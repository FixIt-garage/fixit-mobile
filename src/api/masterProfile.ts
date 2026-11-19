import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiRequest } from '../../api/client';
import { withMock } from './mock';

type MasterProfileResponse = {
  id: number | null;
  city: string | null;
  district: string | null;
  experience_years: number | null;
  call_out_price: number | null;
  schedule: string | null;
  is_volunteer: boolean;
  rating: number | null;
  reviews_count: number;
  categories: { id: number }[];
  completeness: {
    filled: number;
    total: number;
    percent: number;
    next_field: string | null;
  };
};

export type MasterCompleteness = {
  filled: number;
  total: number;
  percent: number;
  nextField: string | null;
};

export type MasterProfile = {
  id: number | null;
  city: string | null;
  district: string | null;
  experienceYears: number | null;
  callOutPrice: number | null;
  schedule: string | null;
  isVolunteer: boolean;
  rating: number | null;
  reviewsCount: number;
  categoriesCount: number;
  completeness: MasterCompleteness;
};

export function toMasterProfile(response: MasterProfileResponse): MasterProfile {
  return {
    id: response.id,
    city: response.city,
    district: response.district,
    experienceYears: response.experience_years,
    callOutPrice: response.call_out_price,
    schedule: response.schedule,
    isVolunteer: response.is_volunteer,
    rating: response.rating,
    reviewsCount: response.reviews_count,
    categoriesCount: response.categories.length,
    completeness: {
      filled: response.completeness.filled,
      total: response.completeness.total,
      percent: response.completeness.percent,
      nextField: response.completeness.next_field,
    },
  };
}

export const MOCK_MASTER_PROFILE: MasterProfile = {
  id: 12,
  city: 'Львів',
  district: null,
  experienceYears: 7,
  callOutPrice: 300,
  schedule: null,
  isVolunteer: true,
  rating: 4.8,
  reviewsCount: 32,
  categoriesCount: 0,
  completeness: { filled: 2, total: 5, percent: 40, nextField: 'categories' },
};

export const MY_MASTER_PROFILE_QUERY_KEY = ['masters', 'me'] as const;

export function fetchMyMasterProfile(): Promise<MasterProfile> {
  return withMock(
    async () => toMasterProfile(await apiGet<MasterProfileResponse>('/masters/me')),
    () => MOCK_MASTER_PROFILE,
  );
}

export function useMyMasterProfile(enabled: boolean) {
  return useQuery({
    queryKey: MY_MASTER_PROFILE_QUERY_KEY,
    queryFn: fetchMyMasterProfile,
    enabled,
  });
}

export function useSetVolunteer() {
  const queryClient = useQueryClient();
  const key = MY_MASTER_PROFILE_QUERY_KEY;

  return useMutation({
    mutationFn: (isVolunteer: boolean) =>
      withMock<MasterProfile | undefined>(
        async () =>
          toMasterProfile(
            await apiRequest<MasterProfileResponse>('/masters/me/volunteer', {
              method: 'PATCH',
              body: { is_volunteer: isVolunteer },
            }),
          ),
        () => undefined,
      ),
    onMutate: async (isVolunteer: boolean) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<MasterProfile>(key);
      if (previous) {
        queryClient.setQueryData<MasterProfile>(key, { ...previous, isVolunteer });
      }
      return { previous };
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(key, data);
      }
    },
    onError: (_error, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
  });
}