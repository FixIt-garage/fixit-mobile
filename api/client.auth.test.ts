import * as tokens from '../src/auth/tokens';
import { ApiError, apiGet, apiRequest, setOnSessionExpired } from './client';

jest.mock('../src/auth/tokens', () => ({
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

const mockedTokens = jest.mocked(tokens);

function jsonResponse(status: number, body: unknown = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

function authHeader(call: unknown[]) {
  const init = call[1] as RequestInit;
  return (init.headers as Record<string, string>).Authorization;
}

describe('api client auth', () => {
  const originalUrl = process.env.EXPO_PUBLIC_API_URL;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = 'http://api.test';
    fetchMock = jest.fn();
    globalThis.fetch = fetchMock;
    jest.clearAllMocks();
    mockedTokens.getAccessToken.mockResolvedValue('access-old');
    mockedTokens.getRefreshToken.mockResolvedValue('refresh-old');
    setOnSessionExpired(null);
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_API_URL = originalUrl;
  });

  it('attaches the bearer token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { id: 1 }));

    await expect(apiGet('/auth/me')).resolves.toEqual({ id: 1 });
    expect(authHeader(fetchMock.mock.calls[0])).toBe('Bearer access-old');
  });

  it('sends no token when auth is off', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200));

    await apiRequest('/auth/login', { method: 'POST', body: {}, auth: false });
    expect(authHeader(fetchMock.mock.calls[0])).toBeUndefined();
  });

  it('refreshes once on 401 and retries with the new token', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401))
      .mockResolvedValueOnce(
        jsonResponse(200, { access_token: 'access-new', refresh_token: 'refresh-new' }),
      )
      .mockResolvedValueOnce(jsonResponse(200, { id: 1 }));

    await expect(apiGet('/auth/me')).resolves.toEqual({ id: 1 });

    expect(fetchMock.mock.calls[1][0]).toBe('http://api.test/auth/refresh');
    expect(mockedTokens.saveTokens).toHaveBeenCalledWith({
      accessToken: 'access-new',
      refreshToken: 'refresh-new',
    });
    expect(authHeader(fetchMock.mock.calls[2])).toBe('Bearer access-new');
  });

  it('logs out when refresh fails', async () => {
    const onExpired = jest.fn();
    setOnSessionExpired(onExpired);
    fetchMock.mockResolvedValueOnce(jsonResponse(401)).mockResolvedValueOnce(jsonResponse(401));

    await expect(apiGet('/auth/me')).rejects.toEqual(new ApiError(401, null));
    expect(mockedTokens.clearTokens).toHaveBeenCalled();
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it('shares one refresh between parallel 401s', async () => {
    fetchMock.mockImplementation((url: string, init: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        return Promise.resolve(
          jsonResponse(200, { access_token: 'access-new', refresh_token: 'refresh-new' }),
        );
      }
      const header = (init.headers as Record<string, string>).Authorization;
      return Promise.resolve(header === 'Bearer access-new' ? jsonResponse(200) : jsonResponse(401));
    });

    await Promise.all([apiGet('/a'), apiGet('/b')]);

    const refreshCalls = fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'));
    expect(refreshCalls).toHaveLength(1);
  });
});