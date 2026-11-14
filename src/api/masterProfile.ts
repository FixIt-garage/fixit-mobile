import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiRequest } from '../../api/client';
import { withMock } from './mock';

type MasterProfileResponse = {
  rating: number | null;
  reviews_count: number;
  years_of_experience: number | null;
  is_volunteer: boolean;
  categories: { id: number }[];
  city: string | null;
  price_from: number | null;
  schedule: string | null;
};

export type MasterProfile = {
  rating: number | null;
  reviewsCount: number;
  yearsOfExperience: number | null;
  isVolunteer: boolean;
  categoriesCount: number;
  city: string | null;
  priceFrom: number | null;
  schedule: string | null;
};

export function toMasterProfile(response: MasterProfileResponse): MasterProfile {
  return {
    rating: response.rating,
    reviewsCount: response.reviews_count,
    yearsOfExperience: response.years_of_experience,
    isVolunteer: response.is_volunteer,
    categoriesCount: response.categories.length,
    city: response.city,
    priceFrom: response.price_from,
    schedule: response.schedule,
  };
}

export const MOCK_MASTER_PROFILE: MasterProfile = {
  rating: 4.8,
  reviewsCount: 32,
  yearsOfExperience: 7,
  isVolunteer: true,
  categoriesCount: 0,
  city: null,
  priceFrom: 300,
  schedule: null,
};

export function masterProfileKey(userId: number | undefined) {
  return ['masters', userId] as const;
}

export function fetchMasterProfile(userId: number): Promise<MasterProfile> {
  return withMock(
    async () => toMasterProfile(await apiGet<MasterProfileResponse>(`/masters/${userId}`)),
    () => MOCK_MASTER_PROFILE,
  );
}

export function useMyMasterProfile(userId: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: masterProfileKey(userId),
    queryFn: () => fetchMasterProfile(userId as number),
    enabled: enabled && userId !== undefined,
  });
}

export function useSetVolunteer(userId: number | undefined) {
  const queryClient = useQueryClient();
  const key = masterProfileKey(userId);

  return useMutation({
    mutationFn: (isVolunteer: boolean) =>
      withMock(
        () =>
          apiRequest<unknown>('/masters/me/volunteer', {
            method: 'PATCH',
            body: { is_volunteer: isVolunteer },
          }),
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
    onError: (_error, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
  });
}