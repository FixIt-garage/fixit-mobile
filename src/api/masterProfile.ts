import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiRequest, getAuthSessionGeneration } from '../../api/client';
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

export function myMasterProfileKey(userId: number | undefined) {
  return ['masters', 'me', userId] as const;
}

export function fetchMyMasterProfile(): Promise<MasterProfile> {
  return withMock(
    async () => toMasterProfile(await apiGet<MasterProfileResponse>('/masters/me')),
    () => MOCK_MASTER_PROFILE,
  );
}

export function useMyMasterProfile(userId: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: myMasterProfileKey(userId),
    queryFn: fetchMyMasterProfile,
    enabled: enabled && userId !== undefined,
  });
}

export function useSetVolunteer(userId: number | undefined) {
  const queryClient = useQueryClient();

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
      const key = myMasterProfileKey(userId);
      const generation = getAuthSessionGeneration();
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<MasterProfile>(key);
      if (previous) {
        queryClient.setQueryData<MasterProfile>(key, { ...previous, isVolunteer });
      }
      return { key, generation, previous };
    },
    onSuccess: (data, _value, context) => {
      if (data && context && context.generation === getAuthSessionGeneration()) {
        queryClient.setQueryData(context.key, data);
      }
    },
    onError: (_error, _value, context) => {
      if (context?.previous && context.generation === getAuthSessionGeneration()) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
  });
}