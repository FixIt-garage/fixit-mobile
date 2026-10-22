export async function apiGet<T>(path: string): Promise<T> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');

  if (!apiUrl) {
    throw new Error(
      'API URL is not configured. Set EXPO_PUBLIC_API_URL in .env.',
    );
  }

  const response = await fetch(`${apiUrl}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
