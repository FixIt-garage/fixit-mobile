import { waitFor } from '@testing-library/react-native';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../src/auth/tokens';
import { logout } from '../src/auth/api';
import {
  ApiError,
  ApiUnavailableError,
  apiRequest,
  getAuthSessionGeneration,
  invalidateAuthSession,
  setOnSessionExpired,
} from './client';

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => (body === null ? '' : JSON.stringify(body)),
  } as unknown as Response;
}

const fetchMock = jest.fn(
  (url: string, init?: RequestInit): Promise<Response> =>
    Promise.reject(new Error(`Unexpected fetch ${init?.method ?? 'GET'} ${url}`)),
);
const onExpired = jest.fn();

beforeAll(() => {
  process.env.EXPO_PUBLIC_API_URL = 'https://api.test';
});

beforeEach(async () => {
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  jest.clearAllMocks();
  invalidateAuthSession();
  await clearTokens();
  await saveTokens({ accessToken: 'old-access', refreshToken: 'old-refresh' });
  setOnSessionExpired(onExpired);
});

afterEach(() => {
  setOnSessionExpired(null);
});

describe('session safety', () => {
  it('keeps tokens empty when logout finishes while refresh is pending', async () => {
    let resolveRefresh: (response: Response) => void = () => { };
    const refreshResponse = new Promise<Response>((resolve) => {
      resolveRefresh = resolve;
    });

    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return refreshResponse;
      }
      if (url.endsWith('/auth/logout')) {
        return Promise.resolve(jsonResponse(204, null));
      }
      return Promise.resolve(jsonResponse(401, null));
    });

    const request = apiRequest('/requests').catch((error: unknown) => error);

    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([url]) => url.endsWith('/auth/refresh'))).toBe(true),
    );

    await logout();

    resolveRefresh(
      jsonResponse(200, {
        access_token: 'new-access',
        refresh_token: 'new-refresh',
        token_type: 'bearer',
      }),
    );

    const error = await request;

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect(await getAccessToken()).toBeNull();
    expect(await getRefreshToken()).toBeNull();
    expect(onExpired).not.toHaveBeenCalled();
  });

  it('keeps the session when refresh fails with a network error', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return Promise.reject(new TypeError('Network request failed'));
      }
      return Promise.resolve(jsonResponse(401, null));
    });

    const error = await apiRequest('/requests').catch((caught: unknown) => caught);

    // Сервер оновлення недоступний — це не означає, що сесія недійсна: токени лишаються
    expect(error).toBeInstanceOf(ApiUnavailableError);
    expect(onExpired).not.toHaveBeenCalled();
    expect(await getAccessToken()).toBe('old-access');
    expect(await getRefreshToken()).toBe('old-refresh');
  });

  it('keeps the session when refresh answers 5xx and refreshes on the next try', async () => {
    let refreshStatus = 503;
    fetchMock.mockImplementation((url: string, init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        return Promise.resolve(
          refreshStatus === 200
            ? jsonResponse(200, { access_token: 'new-access', refresh_token: 'new-refresh', token_type: 'bearer' })
            : jsonResponse(refreshStatus, null),
        );
      }
      const auth = (init?.headers as Record<string, string> | undefined)?.Authorization;
      return Promise.resolve(
        auth === 'Bearer new-access' ? jsonResponse(200, { ok: true }) : jsonResponse(401, null),
      );
    });

    const first = await apiRequest('/requests').catch((caught: unknown) => caught);
    expect(first).toBeInstanceOf(ApiUnavailableError);
    expect(onExpired).not.toHaveBeenCalled();
    expect(await getRefreshToken()).toBe('old-refresh');

    refreshStatus = 200;
    await expect(apiRequest('/requests')).resolves.toEqual({ ok: true });
    expect(await getAccessToken()).toBe('new-access');
    expect(onExpired).not.toHaveBeenCalled();
  });

  it('still ends the session when refresh is rejected with 401', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse(401, null)));

    const error = await apiRequest('/requests').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect(onExpired).toHaveBeenCalledTimes(1);
    expect(await getAccessToken()).toBeNull();
    expect(await getRefreshToken()).toBeNull();
  });

  it('ends the session when refresh returns invalid JSON', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => {
            throw new SyntaxError('Unexpected token');
          },
        } as unknown as Response);
      }
      return Promise.resolve(jsonResponse(401, null));
    });

    const error = await apiRequest('/requests').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect(onExpired).toHaveBeenCalledTimes(1);
    expect(await getAccessToken()).toBeNull();
  });
  it('does not refresh for a request that got 401 after logout started', async () => {
    let resolveRequest: (response: Response) => void = () => { };
    const requestResponse = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    let resolveLogout: (response: Response) => void = () => { };
    const logoutResponse = new Promise<Response>((resolve) => {
      resolveLogout = resolve;
    });
    let resolveRefresh: (response: Response) => void = () => { };
    const refreshResponse = new Promise<Response>((resolve) => {
      resolveRefresh = resolve;
    });

    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return refreshResponse;
      }
      if (url.endsWith('/auth/logout')) {
        return logoutResponse;
      }
      return requestResponse;
    });

    const request = apiRequest('/requests').catch((caught: unknown) => caught);

    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([url]) => url.endsWith('/requests'))).toBe(true),
    );

    const logoutDone = logout();

    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([url]) => url.endsWith('/auth/logout'))).toBe(true),
    );

    resolveRequest(jsonResponse(401, null));
    resolveLogout(jsonResponse(204, null));
    await logoutDone;

    resolveRefresh(
      jsonResponse(200, {
        access_token: 'new-access',
        refresh_token: 'new-refresh',
        token_type: 'bearer',
      }),
    );

    const error = await request;

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect(fetchMock.mock.calls.some(([url]) => url.endsWith('/auth/refresh'))).toBe(false);
    expect(await getAccessToken()).toBeNull();
    expect(await getRefreshToken()).toBeNull();
    expect(onExpired).not.toHaveBeenCalled();
  });
  it('starts a new session generation when refresh fails', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return Promise.resolve(jsonResponse(401, null));
      }
      return Promise.resolve(jsonResponse(401, null));
    });
    const before = getAuthSessionGeneration();

    await apiRequest('/requests').catch(() => undefined);

    expect(getAuthSessionGeneration()).toBe(before + 1);
    expect(onExpired).toHaveBeenCalledTimes(1);
  });
});