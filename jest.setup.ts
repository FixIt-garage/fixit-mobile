// Runs before every test file.
// Shared mocks and settings for all tests will live here.

// Підробні жести й анімації для тестів: нативних модулів у Jest немає
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

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