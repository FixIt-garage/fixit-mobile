// Runs before every test file.
// Shared mocks and settings for all tests will live here.
jest.setTimeout(10000);

// Підробне сховище замість справжнього async storage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest"),
);
// Підробна навігація: запамʼятовує виклики navigate / goBack
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  };
});

// Після кожного тесту повертаємо справжній fetch
const originalFetch = global.fetch;
afterEach(() => {
  global.fetch = originalFetch;
});
