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

/**
 * Сервер тимчасово недоступний (немає мережі або він відповів 5xx), тож сесію перевірити не вдалося.
 * Токени при цьому не стираємо: це не означає, що сесія недійсна, і запит можна повторити.
 */
export class ApiUnavailableError extends Error {
  readonly retryable = true;

  constructor() {
    super('API is temporarily unavailable');
    this.name = 'ApiUnavailableError';
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

// ok — нові токени збережено; rejected — сервер відмовив (сесія недійсна);
// unavailable — сервер не відповів або відповів 5xx (сесія може бути ще дійсна)
type RefreshResult = { status: 'ok'; accessToken: string } | { status: 'rejected' } | { status: 'unavailable' };

let refreshInFlight: Promise<RefreshResult> | null = null;
let sessionGeneration = 0;

export function invalidateAuthSession(): void {
  sessionGeneration += 1;
  refreshInFlight = null;
}

export function getAuthSessionGeneration(): number {
  return sessionGeneration;
}

async function requestNewTokens(baseUrl: string, generation: number): Promise<RefreshResult> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return { status: 'rejected' };
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    return { status: 'unavailable' };
  }

  if (response.status >= 500) {
    return { status: 'unavailable' };
  }

  if (!response.ok) {
    return { status: 'rejected' };
  }

  try {
    const tokens = (await response.json()) as TokenResponse;

    if (generation !== sessionGeneration) {
      return { status: 'rejected' };
    }

    await saveTokens({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
    return { status: 'ok', accessToken: tokens.access_token };
  } catch {
    return { status: 'rejected' };
  }
}

function refreshAccessToken(baseUrl: string, generation: number): Promise<RefreshResult> {
  if (generation !== sessionGeneration) {
    return Promise.resolve({ status: 'rejected' });
  }

  if (refreshInFlight) {
    return refreshInFlight;
  }

  const refresh = requestNewTokens(baseUrl, generation).finally(() => {
    if (refreshInFlight === refresh) {
      refreshInFlight = null;
    }
  });
  refreshInFlight = refresh;
  return refresh;
}

async function endSession(): Promise<void> {
  invalidateAuthSession();
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
    if (generation !== sessionGeneration) {
      throw new ApiError(401, null);
    }

    const refresh = await refreshAccessToken(baseUrl, generation);

    if (generation !== sessionGeneration) {
      throw new ApiError(401, null);
    }

    if (refresh.status === 'unavailable') {
      throw new ApiUnavailableError();
    }

    if (refresh.status === 'rejected') {
      await endSession();
      throw new ApiError(401, null);
    }

    response = await send(baseUrl, path, options, refresh.accessToken);
  }

  return parse<T>(response);
}

export function apiGet<T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
  return apiRequest<T>(path, { ...options, method: 'GET' });
}