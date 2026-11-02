import * as SecureStore from 'expo-secure-store';

export const ACCESS_TOKEN_KEY = 'access_token';

export async function hasStoredAccessToken(): Promise<boolean> {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

  return token !== null;
}
