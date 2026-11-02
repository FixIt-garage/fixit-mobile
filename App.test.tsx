import { render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import App from './App';

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

jest.mock('./screens/HomeScreen', () => {
  const { Text } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return function MockHomeScreen() {
    return <Text>Home test screen</Text>;
  };
});

jest.mock('./screens/WelcomeScreen', () => {
  const { Text } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return function MockWelcomeScreen() {
    return <Text>Welcome test screen</Text>;
  };
});

const mockGetItemAsync = jest.mocked(SecureStore.getItemAsync);

describe('App stored token initialization', () => {
  beforeEach(() => {
    mockGetItemAsync.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('opens Home when an access token exists', async () => {
    mockGetItemAsync.mockResolvedValue('test-access-token');

    await render(<App />);

    expect(await screen.findByText('Home test screen')).toBeTruthy();
  });

  it('opens Welcome when no access token exists', async () => {
    mockGetItemAsync.mockResolvedValue(null);

    await render(<App />);

    expect(await screen.findByText('Welcome test screen')).toBeTruthy();
  });

  it('opens Welcome when SecureStore throws an error', async () => {
    mockGetItemAsync.mockRejectedValue(new Error('SecureStore error'));

    await render(<App />);

    expect(await screen.findByText('Welcome test screen')).toBeTruthy();
  });

  it('does not render navigation before token check finishes', async () => {
    let resolveToken!: (value: string | null) => void;

    mockGetItemAsync.mockReturnValue(
      new Promise((resolve) => {
        resolveToken = resolve;
      }),
    );

    await render(<App />);

    expect(screen.queryByText('Home test screen')).toBeNull();
    expect(screen.queryByText('Welcome test screen')).toBeNull();

    resolveToken(null);

    await waitFor(() => {
      expect(screen.getByText('Welcome test screen')).toBeTruthy();
    });
  });
});
