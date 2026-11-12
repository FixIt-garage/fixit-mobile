import { apiRequest, type TokenResponse } from '../../api/client';
import type { Role } from '../roles';
import { clearTokens, getRefreshToken, saveTokens } from './tokens';

export type ApiUserRole = 'client' | 'master' | 'service_center' | 'volunteer_organization';

const fromApiRole: Record<ApiUserRole, Role> = {
  client: 'client',
  master: 'master',
  service_center: 'center',
  volunteer_organization: 'org',
};

const toApiRole: Record<Role, ApiUserRole> = {
  client: 'client',
  master: 'master',
  center: 'service_center',
  org: 'volunteer_organization',
};

type UserResponse = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  role: ApiUserRole;
  is_active: boolean;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  role: Role;
  isActive: boolean;
};

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: Role;
};

function toUser(response: UserResponse): User {
  return {
    id: response.id,
    email: response.email,
    firstName: response.first_name,
    lastName: response.last_name,
    phone: response.phone,
    address: response.address,
    role: fromApiRole[response.role],
    isActive: response.is_active,
  };
}

async function storeTokens(tokens: TokenResponse): Promise<void> {
  await saveTokens({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
}

export async function login(email: string, password: string): Promise<void> {
  const tokens = await apiRequest<TokenResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  await storeTokens(tokens);
}

export async function register(input: RegisterInput): Promise<void> {
  const tokens = await apiRequest<TokenResponse>('/auth/register', {
    method: 'POST',
    auth: false,
    body: {
      email: input.email,
      password: input.password,
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
      address: input.address,
      role: toApiRole[input.role],
    },
  });
  await storeTokens(tokens);
}

export async function fetchCurrentUser(): Promise<User> {
  return toUser(await apiRequest<UserResponse>('/auth/me'));
}

export async function logout(): Promise<void> {
  const refreshToken = await getRefreshToken();

  try {
    if (refreshToken) {
      await apiRequest('/auth/logout', { method: 'POST', body: { refresh_token: refreshToken } });
    }
  } catch {
  } finally {
    await clearTokens();
  }
}