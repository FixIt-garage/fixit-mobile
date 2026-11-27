import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import { withMock } from './mock';

type VolunteerRequestResponse = {
  id: number;
  title: string;
  description: string;
  category_id: number | null;
  address: string | null;
  city: string | null;
  district: string | null;
  event_date: string | null;
  status: string;
  joined: number;
  needed: number | null;
  is_joined: boolean;
  organization: { id: number; name: string; is_verified: boolean };
};

type VolunteerRequestListResponse = {
  items: VolunteerRequestResponse[];
  total: number;
  limit: number;
  offset: number;
};

export type VolunteerRequest = {
  id: number;
  title: string;
  organizationName: string;
  eventDate: Date;
  place: string;
  joined: number;
  needed: number;
  isJoined: boolean;
};

export type VolunteerRequestList = {
  items: VolunteerRequest[];
  total: number;
};

export const NEARBY_VOLUNTEER_LIMIT = 3;

export function toVolunteerRequest(response: VolunteerRequestResponse): VolunteerRequest | null {
  if (!response.event_date) {
    return null;
  }
  return {
    id: response.id,
    title: response.title,
    organizationName: response.organization.name,
    eventDate: new Date(response.event_date),
    place: response.district ?? response.city ?? response.address ?? '',
    joined: response.joined,
    needed: response.needed ?? response.joined,
    isJoined: response.is_joined,
  };
}

export function volunteerRequestsQuery(city: string | null, limit: number, offset: number): string {
  const params: [string, string][] = [
    ['limit', String(limit)],
    ['offset', String(offset)],
  ];
  if (city) {
    params.unshift(['city', city]);
  }
  return params.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
}

export const MOCK_VOLUNTEER_REQUESTS: VolunteerRequest[] = [
  {
    id: 7,
    title: 'Полагодити обігрівачі в притулку',
    organizationName: 'БФ «Тепла хата»',
    eventDate: new Date(2026, 9, 26, 10, 0),
    place: 'Сихів',
    joined: 2,
    needed: 5,
    isJoined: false,
  },
];

export function fetchVolunteerRequests(
  city: string | null,
  limit: number,
  offset = 0,
): Promise<VolunteerRequestList> {
  return withMock(
    async () => {
      const response = await apiGet<VolunteerRequestListResponse>(
        `/volunteer-requests?${volunteerRequestsQuery(city, limit, offset)}`,
      );
      return {
        items: response.items
          .map(toVolunteerRequest)
          .filter((item): item is VolunteerRequest => item !== null),
        total: response.total,
      };
    },
    () => ({ items: MOCK_VOLUNTEER_REQUESTS, total: MOCK_VOLUNTEER_REQUESTS.length }),
  );
}

export function useNearbyVolunteerRequests(
  userId: number | undefined,
  city: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['volunteer-requests', 'nearby', userId, city],
    queryFn: () => fetchVolunteerRequests(city, NEARBY_VOLUNTEER_LIMIT),
    enabled: enabled && userId !== undefined,
  });
}