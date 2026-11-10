// Runs before every test file.
// Shared mocks and settings for all tests will live here.

// Підробні жести для тестів; Reanimated у Jest працює через веб-версію (resolver у конфігу)
import 'react-native-gesture-handler/jestSetup';
import { setUpTests } from 'react-native-reanimated';

setUpTests();

// Тест-утиліти Storybook (storybook/test) розраховані на браузер і на кожному тесті
// звертаються до navigator.clipboard. У React Native Jest на Node < 21 navigator немає,
// тож додаємо порожній, щоб portable stories працювали однаково локально і в CI.
const globalWithNavigator = globalThis as { navigator?: object; window?: { navigator?: object } };
globalWithNavigator.navigator ??= {};
if (globalWithNavigator.window) {
  globalWithNavigator.window.navigator ??= globalWithNavigator.navigator;
}

// Жести в Jest: справжній gesture-handler хоче UI-потік телефона, якого тут немає.
// GestureDetector і GestureHandlerRootView просто показують вміст.
// (SlideButton.test.tsx має свій mock, який ще й запамʼятовує обробники жесту.)
jest.mock('react-native-gesture-handler', () => {
  const chain: Record<string, unknown> = new Proxy({}, { get: () => () => chain });
  const passThrough = ({ children }: { children: import('react').ReactNode }) => children;
  return {
    GestureDetector: passThrough,
    GestureHandlerRootView: passThrough,
    Gesture: { Pan: () => chain },
  };
});

// Safe area у Jest: відступи вирізу й статус-бару завжди нульові
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('lucide-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');

  const MockLucideIcon = () => React.createElement(View, { testID: 'mock-lucide-icon' });

  return new Proxy<Record<string | symbol, unknown>>(
    { __esModule: true },
    { get: (target, name) => (name in target ? target[name] : MockLucideIcon) },
  );
});
jest.setTimeout(10000);

// Підробне сховище замість справжнього async storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Підробна навігація: запамʼятовує виклики navigate / goBack
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  };
});

// Після кожного тесту повертаємо справжній fetch
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});