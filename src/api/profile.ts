import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import { fromApiRole, type ApiUserRole } from '../auth/api';
import type { Role } from '../roles';
import { withMock } from './mock';

type UserProfileResponse = {
  id: number;
  public_id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  avatar_url: string | null;
  role: ApiUserRole;
  stats: {
    requests_count: number;
    reviews_count: number;
    member_since_year: number;
  };
};

export type Profile = {
  id: number;
  publicId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  avatarUrl: string | null;
  role: Role;
  stats: {
    requestsCount: number;
    reviewsCount: number;
    memberSinceYear: number;
  };
};

export function toProfile(response: UserProfileResponse): Profile {
  return {
    id: response.id,
    publicId: response.public_id,
    email: response.email,
    firstName: response.first_name,
    lastName: response.last_name,
    phone: response.phone,
    address: response.address,
    city: response.city,
    avatarUrl: response.avatar_url,
    role: fromApiRole[response.role],
    stats: {
      requestsCount: response.stats.requests_count,
      reviewsCount: response.stats.reviews_count,
      memberSinceYear: response.stats.member_since_year,
    },
  };
}

export const MOCK_PROFILE: Profile = {
  id: 1,
  publicId: 3120,
  email: 'oleksandr.koval@gmail.com',
  firstName: 'Олександр',
  lastName: 'Коваль',
  phone: '+380671234567',
  address: 'Львів, вул. Наукова, 7',
  city: 'Львів',
  avatarUrl: null,
  role: 'client',
  stats: { requestsCount: 3, reviewsCount: 2, memberSinceYear: 2026 },
};

export const MY_PROFILE_QUERY_KEY = ['users', 'me'] as const;

export function fetchMyProfile(): Promise<Profile> {
  return withMock(
    async () => toProfile(await apiGet<UserProfileResponse>('/users/me')),
    () => MOCK_PROFILE,
  );
}

export function useMyProfile() {
  return useQuery({ queryKey: MY_PROFILE_QUERY_KEY, queryFn: fetchMyProfile });
}