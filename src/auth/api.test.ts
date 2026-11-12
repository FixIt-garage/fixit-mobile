import * as client from '../../api/client';
import * as tokens from './tokens';
import { fetchCurrentUser, logout, register } from './api';

jest.mock('../../api/client', () => ({ apiRequest: jest.fn(), invalidateAuthSession: jest.fn() }));
jest.mock('./tokens', () => ({
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getRefreshToken: jest.fn(),
}));

const apiRequest = jest.mocked(client.apiRequest);
const mockedTokens = jest.mocked(tokens);

describe('auth api', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps the backend user and role to the app format', async () => {
    apiRequest.mockResolvedValueOnce({
      id: 7,
      email: 'a@b.ua',
      first_name: 'Анна',
      last_name: 'Шеремета',
      phone: null,
      address: null,
      role: 'service_center',
      is_active: true,
    });

    await expect(fetchCurrentUser()).resolves.toEqual({
      id: 7,
      email: 'a@b.ua',
      firstName: 'Анна',
      lastName: 'Шеремета',
      phone: null,
      address: null,
      role: 'center',
      isActive: true,
    });
  });

  it('registers with the backend role and field names and stores tokens', async () => {
    apiRequest.mockResolvedValueOnce({ access_token: 'a', refresh_token: 'r', token_type: 'bearer' });

    await register({
      email: 'a@b.ua',
      password: 'password1',
      firstName: 'Анна',
      lastName: 'Шеремета',
      role: 'org',
    });

    expect(apiRequest).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      auth: false,
      body: {
        email: 'a@b.ua',
        password: 'password1',
        first_name: 'Анна',
        last_name: 'Шеремета',
        phone: undefined,
        address: undefined,
        role: 'volunteer_organization',
      },
    });
    expect(mockedTokens.saveTokens).toHaveBeenCalledWith({ accessToken: 'a', refreshToken: 'r' });
  });

  it('clears tokens on logout even if the server call fails', async () => {
    mockedTokens.getRefreshToken.mockResolvedValueOnce('r');
    apiRequest.mockRejectedValueOnce(new Error('offline'));

    await logout();
    expect(mockedTokens.clearTokens).toHaveBeenCalled();
  });
});