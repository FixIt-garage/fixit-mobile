import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as api from './src/auth/api';
import * as session from './src/auth/session';
import { queryClient } from './src/api/queryClient';
import App from './App';

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('./src/auth/session', () => ({ hasStoredAccessToken: jest.fn() }));

jest.mock('./src/auth/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  fetchCurrentUser: jest.fn(),
  logout: jest.fn(),
}));

jest.mock('./screens/WelcomeScreen', () => {
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');

  return function MockWelcomeScreen() {
    return <Text>Welcome test screen</Text>;
  };
});

jest.mock('./src/api/profile', () => {
  const actual = jest.requireActual('./src/api/profile');
  return {
    ...actual,
    useMyProfile: () => ({
      data: actual.MOCK_PROFILE,
      isPending: false,
      isError: false,
      refetch: jest.fn(),
    }),
  };
});
jest.mock('./src/api/masterProfile', () => ({
  ...jest.requireActual('./src/api/masterProfile'),
  useMyMasterProfile: () => ({
    data: undefined,
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  }),
  useSetVolunteer: () => ({ mutate: jest.fn() }),
}));

const mockedSession = jest.mocked(session);
const mockedApi = jest.mocked(api);

function userWithRole(role: api.User['role']): api.User {
  return {
    id: 1,
    email: 'a@b.ua',
    firstName: 'Анна',
    lastName: 'Шеремета',
    phone: null,
    address: null,
    role,
    isActive: true,
  };
}

describe('App navigation by session', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => {
    queryClient.clear();
  });
  it('opens Welcome when no access token exists', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(false);

    await render(<App />);
    expect(await screen.findByText('Welcome test screen')).toBeTruthy();
  });

  it('opens Welcome when the token check fails', async () => {
    mockedSession.hasStoredAccessToken.mockRejectedValue(new Error('SecureStore error'));

    await render(<App />);
    expect(await screen.findByText('Welcome test screen')).toBeTruthy();
  });

  it('opens the client home with the tab bar for a client', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(true);
    mockedApi.fetchCurrentUser.mockResolvedValue(userWithRole('client'));

    await render(<App />);
    expect(await screen.findByText('Головна клієнта')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Заявки' })).toBeTruthy();
  });

  it('opens the master home for a master', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(true);
    mockedApi.fetchCurrentUser.mockResolvedValue(userWithRole('master'));

    await render(<App />);
    expect(await screen.findByText('Головна майстра')).toBeTruthy();
  });

  it('switches tabs from the tab bar', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(true);
    mockedApi.fetchCurrentUser.mockResolvedValue(userWithRole('client'));

    await render(<App />);
    await screen.findByText('Головна клієнта');
    await fireEvent.press(screen.getByRole('tab', { name: 'Заявки' }));

    expect(await screen.findByText('Мої заявки')).toBeTruthy();
  });

  it('returns to Welcome after signing out', async () => {
    mockedSession.hasStoredAccessToken.mockResolvedValue(true);
    mockedApi.fetchCurrentUser.mockResolvedValue(userWithRole('client'));
    mockedApi.logout.mockResolvedValue();

    await render(<App />);
    await screen.findByText('Головна клієнта');
    await fireEvent.press(screen.getByRole('tab', { name: 'Профіль' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Вийти' }));

    expect(await screen.findByText('Welcome test screen')).toBeTruthy();
  });

  it('does not render navigation before the session check finishes', async () => {
    let resolveToken!: (value: boolean) => void;
    mockedSession.hasStoredAccessToken.mockReturnValue(
      new Promise((resolve) => {
        resolveToken = resolve;
      }),
    );

    await render(<App />);
    expect(screen.queryByText('Welcome test screen')).toBeNull();

    resolveToken(false);
    await waitFor(() => expect(screen.getByText('Welcome test screen')).toBeTruthy());
  });
});