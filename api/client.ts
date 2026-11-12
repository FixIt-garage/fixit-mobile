import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../src/auth/tokens';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`API request failed: ${status}`);
    this.name = 'ApiError';
  }
}

let onSessionExpired: (() => void) | null = null;

export function setOnSessionExpired(handler: (() => void) | null): void {
  onSessionExpired = handler;
}

function getBaseUrl(): string {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');

  if (!apiUrl) {
    throw new Error('API URL is not configured. Set EXPO_PUBLIC_API_URL in .env.');
  }

  return apiUrl;
}

function send(
  baseUrl: string,
  path: string,
  { method = 'GET', body }: RequestOptions,
  accessToken: string | null,
): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

let refreshInFlight: Promise<string | null> | null = null;
let sessionGeneration = 0;

export function invalidateAuthSession(): void {
  sessionGeneration += 1;
  refreshInFlight = null;
}

async function requestNewTokens(baseUrl: string, generation: number): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const tokens = (await response.json()) as TokenResponse;

    if (generation !== sessionGeneration) {
      return null;
    }

    await saveTokens({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
    return tokens.access_token;
  } catch {
    return null;
  }
}

function refreshAccessToken(baseUrl: string): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  const refresh = requestNewTokens(baseUrl, sessionGeneration).finally(() => {
    if (refreshInFlight === refresh) {
      refreshInFlight = null;
    }
  });
  refreshInFlight = refresh;
  return refresh;
}

async function endSession(): Promise<void> {
  await clearTokens();
  onSessionExpired?.();
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true } = options;
  const baseUrl = getBaseUrl();
  const generation = sessionGeneration;
  const accessToken = auth ? await getAccessToken() : null;

  let response = await send(baseUrl, path, options, accessToken);

  if (auth && response.status === 401) {
    const newAccessToken = await refreshAccessToken(baseUrl);

    if (generation !== sessionGeneration) {
      throw new ApiError(401, null);
    }

    if (!newAccessToken) {
      await endSession();
      throw new ApiError(401, null);
    }

    response = await send(baseUrl, path, options, newAccessToken);
  }

  return parse<T>(response);
}

export function apiGet<T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
  return apiRequest<T>(path, { ...options, method: 'GET' });
}