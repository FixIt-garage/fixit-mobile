const MOCK_DELAY_MS = 300;

let mocksEnabled = process.env.EXPO_PUBLIC_USE_MOCKS === 'true';

export function isMockMode(): boolean {
  return mocksEnabled;
}

export function setMockMode(enabled: boolean): void {
  mocksEnabled = enabled;
}

export function withMock<T>(real: () => Promise<T>, mock: () => T): Promise<T> {
  if (!mocksEnabled) {
    return real();
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(mock()), MOCK_DELAY_MS);
  });
}