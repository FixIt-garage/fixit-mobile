import 'react-native-gesture-handler/jestSetup';
import { setUpTests } from 'react-native-reanimated';

setUpTests();

const globalWithNavigator = globalThis as { navigator?: object; window?: { navigator?: object } };
globalWithNavigator.navigator ??= {};
if (globalWithNavigator.window) {
  globalWithNavigator.window.navigator ??= globalWithNavigator.navigator;
}

jest.mock('react-native-gesture-handler', () => {
  const chain: Record<string, unknown> = new Proxy({}, { get: () => () => chain });
  const passThrough = ({ children }: { children: import('react').ReactNode }) => children;
  return {
    GestureDetector: passThrough,
    GestureHandlerRootView: passThrough,
    Gesture: { Pan: () => chain },
  };
});

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('lucide-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');

  const MockLucideIcon = ({ testID }: { testID?: string }) =>
    React.createElement(View, { testID: testID ?? 'mock-lucide-icon' });

  return new Proxy<Record<string | symbol, unknown>>(
    { __esModule: true },
    { get: (target, name) => (name in target ? target[name] : MockLucideIcon) },
  );
});

jest.setTimeout(10000);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  };
});

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});