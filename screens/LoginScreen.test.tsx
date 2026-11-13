import { Alert } from 'react-native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { PropsWithChildren } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import { ApiError } from '../api/client';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../src/auth/AuthProvider';
import { ThemeProvider } from '../src/theme';

jest.mock('../src/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

const mockSignIn = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
} as unknown as NativeStackScreenProps<RootStackParamList, 'Login'>['navigation'];

const mockRoute = {
  key: 'Login-test',
  name: 'Login',
} as NativeStackScreenProps<RootStackParamList, 'Login'>['route'];

const mockedUseAuth = jest.mocked(useAuth);

const EMAIL_PLACEHOLDER = 'name@gmail.com';
const PASSWORD_PLACEHOLDER = 'Ваш пароль';

function Wrapper({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, right: 0, bottom: 0, left: 0 },
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}

async function renderLoginScreen() {
  return render(
    <LoginScreen navigation={mockNavigation} route={mockRoute} />,
    { wrapper: Wrapper },
  );
}

async function submitLogin() {
  await fireEvent(
    screen.getByRole('button', { name: 'Увійти' }),
    'accessibilityAction',
    { nativeEvent: { actionName: 'activate' } },
  );
}

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      state: { status: 'signedOut' },
      signIn: mockSignIn,
      signUp: jest.fn(),
      signOut: jest.fn(),
    });

    mockSignIn.mockResolvedValue(undefined);
  });

  it('renders header, email and password inputs', async () => {
    await renderLoginScreen();

    expect(screen.getByText('Акаунт FixIt')).toBeTruthy();
    expect(screen.getByText('З поверненням!')).toBeTruthy();
    expect(screen.getByText('Пошта')).toBeTruthy();
    expect(screen.getByText('Пароль')).toBeTruthy();
    expect(screen.getByPlaceholderText(EMAIL_PLACEHOLDER)).toBeTruthy();
    expect(screen.getByPlaceholderText(PASSWORD_PLACEHOLDER)).toBeTruthy();
  });

  it('signs in with entered email and password', async () => {
    await renderLoginScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText(EMAIL_PLACEHOLDER),
      'user@example.com',
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText(PASSWORD_PLACEHOLDER),
      'password123',
    );

    await submitLogin();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        'user@example.com',
        'password123',
      );
    });
  });

  it('shows an error for incorrect credentials', async () => {
    mockSignIn.mockRejectedValue(new ApiError(401, null));

    await renderLoginScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText(EMAIL_PLACEHOLDER),
      'user@example.com',
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText(PASSWORD_PLACEHOLDER),
      'wrongpassword',
    );

    await submitLogin();

    expect(
      await screen.findByText('Неправильна електронна пошта або пароль'),
    ).toBeTruthy();
  });

  it('does not call signIn with an invalid email', async () => {
    await renderLoginScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText(EMAIL_PLACEHOLDER),
      'invalid-email',
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText(PASSWORD_PLACEHOLDER),
      'password123',
    );

    await submitLogin();

    expect(
      await screen.findByText('Введіть коректну електронну пошту'),
    ).toBeTruthy();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('navigates to WhoAreYou when registration link is pressed', async () => {
    await renderLoginScreen();

    await fireEvent.press(screen.getByText('Зареєструватися'));

    expect(mockNavigate).toHaveBeenCalledWith('WhoAreYou');
  });

  it('goes back when the back button is pressed', async () => {
    await renderLoginScreen();

    await fireEvent.press(screen.getByLabelText('Назад'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('shows a placeholder alert for forgot password', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    await renderLoginScreen();

    await fireEvent.press(screen.getByText('Забули пароль?'));

    expect(alertSpy).toHaveBeenCalledWith(
      'Відновлення пароля',
      'Функція відновлення пароля буде доступна пізніше.',
    );

    alertSpy.mockRestore();
  });
});