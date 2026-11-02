// Runs before every test file.
// Shared mocks and settings for all tests will live here.

// Підробні жести для тестів; Reanimated у Jest працює через веб-версію (resolver у конфігу)
import 'react-native-gesture-handler/jestSetup';
import { setUpTests } from 'react-native-reanimated';

setUpTests();

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