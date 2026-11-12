import { Pressable, Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as client from '../../api/client';
import * as api from './api';
import * as session from './session';
import { AuthProvider, useAuth } from './AuthProvider';

jest.mock('../../api/client', () => ({ setOnSessionExpired: jest.fn() }));
jest.mock('./api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  fetchCurrentUser: jest.fn(),
  logout: jest.fn(),
}));
jest.mock('./session', () => ({ hasStoredAccessToken: jest.fn() }));

const mockedApi = jest.mocked(api);
const mockedSession = jest.mocked(session);
const setOnSessionExpired = jest.mocked(client.setOnSessionExpired);

const master: api.User = {
  id: 1,
  email: 'a@b.ua',
  firstName: 'Анна',
  lastName: 'Шеремета',
  phone: null,
  address: null,
  role: 'master',
  isActive: true,
};

function Probe() {
  const { state, signIn, signOut } = useAuth();
  return (
    <>
      <Text>{state.status === 'signedIn' ? `signedIn:${state.user.role}` : state.status}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="sign in"
        onPress={() => void signIn('a@b.ua', 'password1')}
      />
      <Pressable accessibilityRole="button" accessibilityLabel="sign out" onPress={() => void signOut()} />
    </>
  );
}

function renderProbe() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
}

describe('AuthProvider', () => {
  beforeEach(() => jest.clearAllMocks());

  it('restores a stored session with the user role', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(true);
    mockedApi.fetchCurrentUser.mockResolvedValue(master);

    await renderProbe();
    expect(await screen.findByText('signedIn:master')).toBeTruthy();
  });

  it('is signed out without a stored token', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(false);

    await renderProbe();
    expect(await screen.findByText('signedOut')).toBeTruthy();
  });

  it('signs in and loads the user', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(false);
    mockedApi.login.mockResolvedValue();
    mockedApi.fetchCurrentUser.mockResolvedValue(master);

    await renderProbe();
    await screen.findByText('signedOut');
    await fireEvent.press(screen.getByRole('button', { name: 'sign in' }));

    expect(await screen.findByText('signedIn:master')).toBeTruthy();
    expect(mockedApi.login).toHaveBeenCalledWith('a@b.ua', 'password1');
  });

  it('signs out when the API client reports an expired session', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(true);
    mockedApi.fetchCurrentUser.mockResolvedValue(master);

    await renderProbe();
    await screen.findByText('signedIn:master');

    const handler = setOnSessionExpired.mock.calls.find(([fn]) => fn)?.[0];
    await act(async () => handler?.());

    expect(await screen.findByText('signedOut')).toBeTruthy();
  });
});