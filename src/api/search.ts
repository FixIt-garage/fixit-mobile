import { useInfiniteQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import { withMock } from './mock';

export const SEARCH_PAGE_SIZE = 20;

type CategoryResponse = {
  id: number;
  name: string;
  name_uk?: string | null;
};

type MasterSearchItemResponse = {
  id: number;
  public_id: number;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  city: string | null;
  district: string | null;
  experience_years: number | null;
  call_out_price: number | null;
  schedule: string | null;
  is_volunteer: boolean;
  rating: number | null;
  reviews_count: number;
  categories: CategoryResponse[];
};

type ServiceCenterSearchItemResponse = {
  id: number;
  public_id: number;
  name: string;
  address: string | null;
  city: string | null;
  rating: number | null;
  reviews_count: number;
  is_open: boolean;
  working_status: string;
};

type SearchPageResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type SearchParams = {
  city: string;
  categoryId: number;
};

export type SearchPage<T> = {
  items: T[];
  total: number;
};

export type MasterSearchItem = {
  id: number;
  publicId: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isVolunteer: boolean;
  rating: number | null;
  reviewsCount: number;
  specializations: string[];
};

export type ServiceCenterSearchItem = {
  id: number;
  publicId: number;
  name: string;
  address: string | null;
  city: string | null;
  rating: number | null;
  reviewsCount: number;
  isOpen: boolean;
  workingStatus: string;
};

export function toMasterSearchItem(response: MasterSearchItemResponse): MasterSearchItem {
  return {
    id: response.id,
    publicId: response.public_id,
    firstName: response.first_name,
    lastName: response.last_name,
    avatarUrl: response.avatar_url,
    isVolunteer: response.is_volunteer,
    rating: response.rating,
    reviewsCount: response.reviews_count,
    specializations: response.categories.map((category) => category.name_uk ?? category.name),
  };
}

export function toServiceCenterSearchItem(
  response: ServiceCenterSearchItemResponse,
): ServiceCenterSearchItem {
  return {
    id: response.id,
    publicId: response.public_id,
    name: response.name,
    address: response.address,
    city: response.city,
    rating: response.rating,
    reviewsCount: response.reviews_count,
    isOpen: response.is_open,
    workingStatus: response.working_status,
  };
}

export function buildSearchQuery(params: SearchParams, offset: number): string {
  return [
    ['city', params.city],
    ['category_id', String(params.categoryId)],
    ['sort', 'rating'],
    ['limit', String(SEARCH_PAGE_SIZE)],
    ['offset', String(offset)],
  ]
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

export function getNextSearchOffset<T>(
  lastPage: SearchPage<T>,
  allPages: SearchPage<T>[],
): number | undefined {
  const loaded = allPages.reduce((total, page) => total + page.items.length, 0);
  return lastPage.items.length > 0 && loaded < lastPage.total ? loaded : undefined;
}

export const MOCK_MASTER_RESULTS: SearchPage<MasterSearchItem> = {
  items: [
    {
      id: 12,
      publicId: 247,
      firstName: 'Андрій',
      lastName: 'Мельник',
      avatarUrl: null,
      isVolunteer: true,
      rating: 4.8,
      reviewsCount: 32,
      specializations: ['Побутова техніка', 'Електрика'],
    },
    {
      id: 15,
      publicId: 301,
      firstName: 'Олег',
      lastName: 'Савчук',
      avatarUrl: null,
      isVolunteer: false,
      rating: 4.6,
      reviewsCount: 18,
      specializations: ['Пральні машини'],
    },
    {
      id: 21,
      publicId: 355,
      firstName: 'Ігор',
      lastName: 'Бойко',
      avatarUrl: null,
      isVolunteer: false,
      rating: null,
      reviewsCount: 0,
      specializations: ['Побутова техніка'],
    },
  ],
  total: 3,
};

export const MOCK_SERVICE_CENTER_RESULTS: SearchPage<ServiceCenterSearchItem> = {
  items: [
    {
      id: 3,
      publicId: 1182,
      name: 'ТехноСервіс',
      address: 'вул. Городоцька, 45',
      city: 'Львів',
      rating: 4.7,
      reviewsCount: 58,
      isOpen: true,
      workingStatus: 'Відчинено до 19:00',
    },
    {
      id: 5,
      publicId: 1204,
      name: 'Майстерня Плюс',
      address: 'вул. Наукова, 7',
      city: 'Львів',
      rating: 4.3,
      reviewsCount: 21,
      isOpen: false,
      workingStatus: 'Зачинено',
    },
  ],
  total: 2,
};

export function fetchMasterSearch(
  params: SearchParams,
  offset: number,
): Promise<SearchPage<MasterSearchItem>> {
  return withMock(
    async () => {
      const response = await apiGet<SearchPageResponse<MasterSearchItemResponse>>(
        `/search/masters?${buildSearchQuery(params, offset)}`,
      );
      return { items: response.items.map(toMasterSearchItem), total: response.total };
    },
    () => (offset === 0 ? MOCK_MASTER_RESULTS : { items: [], total: MOCK_MASTER_RESULTS.total }),
  );
}

export function fetchServiceCenterSearch(
  params: SearchParams,
  offset: number,
): Promise<SearchPage<ServiceCenterSearchItem>> {
  return withMock(
    async () => {
      const response = await apiGet<SearchPageResponse<ServiceCenterSearchItemResponse>>(
        `/search/service-centers?${buildSearchQuery(params, offset)}`,
      );
      return { items: response.items.map(toServiceCenterSearchItem), total: response.total };
    },
    () =>
      offset === 0
        ? MOCK_SERVICE_CENTER_RESULTS
        : { items: [], total: MOCK_SERVICE_CENTER_RESULTS.total },
  );
}

export function useSearchMasters(params: SearchParams, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['search', 'masters', params.city, params.categoryId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchMasterSearch(params, pageParam),
    getNextPageParam: getNextSearchOffset<MasterSearchItem>,
    enabled,
  });
}

export function useSearchServiceCenters(params: SearchParams, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['search', 'service-centers', params.city, params.categoryId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchServiceCenterSearch(params, pageParam),
    getNextPageParam: getNextSearchOffset<ServiceCenterSearchItem>,
    enabled,
  });
}