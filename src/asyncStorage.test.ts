import AsyncStorage from '@react-native-async-storage/async-storage';

// Перевіряє, що mock AsyncStorage у jest.setup.ts підключається і працює
describe('AsyncStorage mock', () => {
  it('stores and reads a value', async () => {
    await AsyncStorage.setItem('key', 'value');
    await expect(AsyncStorage.getItem('key')).resolves.toBe('value');
  });
});