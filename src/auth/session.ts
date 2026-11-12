import { getAccessToken } from './tokens';

export { ACCESS_TOKEN_KEY } from './tokens';

export async function hasStoredAccessToken(): Promise<boolean> {
  const token = await getAccessToken();

  return token !== null;
}