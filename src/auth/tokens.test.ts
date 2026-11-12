import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokens';

const mockStore = new Map<string, string>();

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn((key: string) => Promise.resolve(mockStore.get(key) ?? null)),
  setItemAsync: jest.fn((key: string, value: string) => {
    mockStore.set(key, value);
    return Promise.resolve();
  }),
  deleteItemAsync: jest.fn((key: string) => {
    mockStore.delete(key);
    return Promise.resolve();
  }),
}));

describe('tokens', () => {
  beforeEach(() => mockStore.clear());

  it('saves and reads both tokens', async () => {
    await saveTokens({ accessToken: 'access-1', refreshToken: 'refresh-1' });

    await expect(getAccessToken()).resolves.toBe('access-1');
    await expect(getRefreshToken()).resolves.toBe('refresh-1');
  });

  it('returns null when nothing is stored', async () => {
    await expect(getAccessToken()).resolves.toBeNull();
    await expect(getRefreshToken()).resolves.toBeNull();
  });

  it('clears both tokens', async () => {
    await saveTokens({ accessToken: 'access-1', refreshToken: 'refresh-1' });
    await clearTokens();

    await expect(getAccessToken()).resolves.toBeNull();
    await expect(getRefreshToken()).resolves.toBeNull();
  });
});