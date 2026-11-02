import { render, screen, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { PropsWithChildren } from 'react';

import WelcomeScreen from './WelcomeScreen';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ThemeProvider } from '../src/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const mockNavigate = jest.fn();

const mockNavigation = {
  navigate: mockNavigate,
} as unknown as Props['navigation'];

const mockRoute = {
  key: 'Welcome-test',
  name: 'Welcome',
} as Props['route'];

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

describe('WelcomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('navigates to WhoAreYou when Start button is pressed', async () => {
    await render(
      <WelcomeScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper: Wrapper },
    );

    await fireEvent.press(screen.getByText('Почати'));

    expect(mockNavigate).toHaveBeenCalledWith('WhoAreYou');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('navigates to Login when Login link is pressed', async () => {
    await render(
      <WelcomeScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper: Wrapper },
    );

    await fireEvent.press(screen.getByText('Увійти'));

    expect(mockNavigate).toHaveBeenCalledWith('Login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
