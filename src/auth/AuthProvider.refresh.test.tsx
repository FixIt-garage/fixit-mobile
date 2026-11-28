import { Text } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';
import { onlineManager } from '@tanstack/react-query';
import { invalidateAuthSession } from '../../api/client';
import { AuthProvider, useAuth } from './AuthProvider';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from './tokens';

// Справжній apiRequest і справжній AuthProvider: підмінено лише сховище токенів і мережу (fetch)
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

const me = {
  id: 7,
  email: 'anna@example.com',
  first_name: 'Анна',
  last_name: 'Коваль',
  role: 'client',
};

let refreshStatus = 503;
let loginCalls = 0;
const fetchMock = jest.fn(
  (url: string, init?: RequestInit): Promise<Response> => {
    if (url.endsWith('/auth/refresh')) {
      return Promise.resolve(
        refreshStatus === 200
          ? jsonResponse(200, {
              access_token: 'new-access',
              refresh_token: 'new-refresh',
              token_type: 'bearer',
            })
          : jsonResponse(refreshStatus, null),
      );
    }
    if (url.endsWith('/auth/login')) {
      loginCalls += 1;
      return Promise.resolve(jsonResponse(500, null));
    }
    if (url.endsWith('/auth/me')) {
      const auth = (init?.headers as Record<string, string> | undefined)
        ?.Authorization;
      // Старий access token уже прострочений, новий — дійсний
      return Promise.resolve(
        auth === 'Bearer new-access'
          ? jsonResponse(200, me)
          : jsonResponse(401, null),
      );
    }
    return Promise.reject(new Error(`Unexpected fetch ${url}`));
  },
);

function Probe() {
  const { state } = useAuth();
  return (
    <Text>
      {state.status === 'signedIn'
        ? `signedIn:${state.user.firstName}`
        : state.status}
    </Text>
  );
}

beforeAll(() => {
  process.env.EXPO_PUBLIC_API_URL = 'https://api.test';
});

beforeEach(async () => {
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  fetchMock.mockClear();
  refreshStatus = 503;
  loginCalls = 0;
  invalidateAuthSession();
  await clearTokens();
  await saveTokens({ accessToken: 'old-access', refreshToken: 'old-refresh' });
});

afterEach(() => onlineManager.setOnline(true));

describe('restoring a session with an expired access token', () => {
  it('stays signed in when refresh is temporarily down and restores once the server is back', async () => {
    onlineManager.setOnline(false);
    await render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    // 401 на /auth/me → 503 на /auth/refresh: не логін, а екран «Немає з'єднання»
    expect(await screen.findByText('offline')).toBeTruthy();
    expect(screen.queryByText('signedOut')).toBeNull();
    expect(await getRefreshToken()).toBe('old-refresh');

    refreshStatus = 200;
    await act(async () => onlineManager.setOnline(true));

    expect(await screen.findByText('signedIn:Анна')).toBeTruthy();
    expect(await getAccessToken()).toBe('new-access');
    expect(loginCalls).toBe(0);
  });

  it('signs out when the server rejects the refresh token', async () => {
    refreshStatus = 401;
    await render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(await screen.findByText('signedOut')).toBeTruthy();
    expect(await getRefreshToken()).toBeNull();
  });
});
