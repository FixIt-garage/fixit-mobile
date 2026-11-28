import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import { withMock } from './mock';

type CategoryResponse = {
  id: number;
  name: string;
  name_uk?: string | null;
};

type ServiceResponse = {
  id: number;
  name: string;
  category_id: number;
};

type OpeningIntervalResponse = {
  open: string;
  close: string;
};

export type OpeningHours = {
  monday: OpeningIntervalResponse | null;
  tuesday: OpeningIntervalResponse | null;
  wednesday: OpeningIntervalResponse | null;
  thursday: OpeningIntervalResponse | null;
  friday: OpeningIntervalResponse | null;
  saturday: OpeningIntervalResponse | null;
  sunday: OpeningIntervalResponse | null;
};

type ServiceCenterResponse = {
  id: number;
  public_id: number;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  rating: number | null;
  reviews_count: number;
  opening_hours: OpeningHours | null;
  is_open: boolean;
  working_status: string;
  categories: CategoryResponse[];
  services: ServiceResponse[];
};

type ReviewResponse = {
  id: number;
  issue_id: number;
  master_id: number | null;
  company_id: number | null;
  rating: number;
  tags: string[];
  comment: string | null;
  created_at: string;
  author_first_name: string;
  author_last_name: string;
  author_avatar_url: string | null;
};

type ReviewListResponse = {
  items: ReviewResponse[];
  total: number;
  limit: number;
  offset: number;
};

export type ServiceCenter = {
  id: number;
  publicId: number;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  rating: number | null;
  reviewsCount: number;
  openingHours: OpeningHours | null;
  isOpen: boolean;
  workingStatus: string;
  categories: {
    id: number;
    name: string;
  }[];
  services: {
    id: number;
    name: string;
    categoryId: number;
  }[];
};

export type ServiceCenterReview = {
  id: number;
  issueId: number;
  rating: number;
  tags: string[];
  comment: string | null;
  createdAt: Date;
  authorFirstName: string;
  authorLastName: string;
  authorAvatarUrl: string | null;
};

export type ServiceCenterReviewList = {
  items: ServiceCenterReview[];
  total: number;
};

export const SERVICE_CENTER_REVIEWS_LIMIT = 3;

export function toServiceCenter(
  response: ServiceCenterResponse,
): ServiceCenter {
  return {
    id: response.id,
    publicId: response.public_id,
    name: response.name,
    address: response.address,
    city: response.city,
    phone: response.phone,
    location: response.location,
    rating: response.rating,
    reviewsCount: response.reviews_count,
    openingHours: response.opening_hours,
    isOpen: response.is_open,
    workingStatus: response.working_status,
    categories: response.categories.map((category) => ({
      id: category.id,
      name: category.name_uk ?? category.name,
    })),
    services: response.services.map((service) => ({
      id: service.id,
      name: service.name,
      categoryId: service.category_id,
    })),
  };
}

export function toServiceCenterReview(
  response: ReviewResponse,
): ServiceCenterReview {
  return {
    id: response.id,
    issueId: response.issue_id,
    rating: response.rating,
    tags: response.tags,
    comment: response.comment,
    createdAt: new Date(response.created_at),
    authorFirstName: response.author_first_name,
    authorLastName: response.author_last_name,
    authorAvatarUrl: response.author_avatar_url,
  };
}

export const MOCK_SERVICE_CENTER: ServiceCenter = {
  id: 18,
  publicId: 1182,
  name: 'ТехноСервіс',
  address: 'вул. Наукова, 7А',
  city: 'Львів',
  phone: '+380671234567',
  location: {
    latitude: 49.815,
    longitude: 24.023,
  },
  rating: 4.6,
  reviewsCount: 58,
  openingHours: {
    monday: { open: '09:00', close: '19:00' },
    tuesday: { open: '09:00', close: '19:00' },
    wednesday: { open: '09:00', close: '19:00' },
    thursday: { open: '09:00', close: '19:00' },
    friday: { open: '09:00', close: '19:00' },
    saturday: { open: '10:00', close: '16:00' },
    sunday: null,
  },
  isOpen: true,
  workingStatus: 'Відчинено до 19:00',
  categories: [
    { id: 1, name: 'Смартфони' },
    { id: 2, name: 'Ноутбуки' },
  ],
  services: [
    { id: 1, name: 'Смартфони', categoryId: 2 },
    { id: 2, name: 'Ноутбуки', categoryId: 2 },
    { id: 3, name: 'Побутова техніка', categoryId: 1 },
    { id: 4, name: 'Телевізори', categoryId: 2 },
  ],
};

export const MOCK_SERVICE_CENTER_REVIEWS: ServiceCenterReviewList = {
  items: [
    {
      id: 1,
      issueId: 10,
      rating: 5,
      tags: [],
      comment: 'Швидко та якісно відремонтували телефон.',
      createdAt: new Date(2026, 9, 21),
      authorFirstName: 'Олена',
      authorLastName: 'Коваль',
      authorAvatarUrl: null,
    },
  ],
  total: 58,
};

export function fetchServiceCenter(
  publicId: number,
): Promise<ServiceCenter> {
  return withMock(
    async () =>
      toServiceCenter(
        await apiGet<ServiceCenterResponse>(`/service-centers/${publicId}`),
      ),
    () => MOCK_SERVICE_CENTER,
  );
}

export function fetchServiceCenterReviews(
  companyId: number,
  limit: number = SERVICE_CENTER_REVIEWS_LIMIT,
): Promise<ServiceCenterReviewList> {
  return withMock(
    async () => {
      const response = await apiGet<ReviewListResponse>(
        `/service-centers/${companyId}/reviews?limit=${limit}&offset=0`,
      );

      return {
        items: response.items.map(toServiceCenterReview),
        total: response.total,
      };
    },
    () => MOCK_SERVICE_CENTER_REVIEWS,
  );
}

export function useServiceCenter(publicId: number) {
  return useQuery({
    queryKey: ['service-centers', publicId, 'public'],
    queryFn: () => fetchServiceCenter(publicId),
  });
}

export function useServiceCenterReviews(companyId: number) {
  return useQuery({
    queryKey: [
      'service-centers',
      companyId,
      'reviews',
      SERVICE_CENTER_REVIEWS_LIMIT,
    ],
    queryFn: () => fetchServiceCenterReviews(companyId),
    enabled: companyId > 0,
  });
}
export type ServiceCenterSearchParams = {
  city: string;
  categoryId: number;
  query: string;
  limit?: number;
  offset?: number;
};

export type ServiceCenterSearchResult = {
  items: ServiceCenter[];
  total: number;
};

type ServiceCenterSearchResponse = {
  items: ServiceCenterResponse[];
  total: number;
  limit: number;
  offset: number;
};

export function fetchServiceCenters(
  params: ServiceCenterSearchParams,
): Promise<ServiceCenterSearchResult> {
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const query = [
    params.city.trim()
      ? `city=${encodeURIComponent(params.city.trim())}`
      : '',
    `category_id=${params.categoryId}`,
    `q=${encodeURIComponent(params.query.trim())}`,
    'sort=rating',
    `limit=${limit}`,
    `offset=${offset}`,
  ]
    .filter(Boolean)
    .join('&');

  return withMock(
    async () => {
      const response = await apiGet<ServiceCenterSearchResponse>(
        `/search/service-centers?${query}`,
      );

      return {
        items: response.items.map(toServiceCenter),
        total: response.total,
      };
    },
    () => ({
      items: [MOCK_SERVICE_CENTER],
      total: 1,
    }),
  );
}

export function useServiceCenters(params: ServiceCenterSearchParams) {
  return useQuery({
    queryKey: [
      'service-centers',
      'search',
      params.city,
      params.categoryId,
      params.query,
      params.limit ?? 20,
      params.offset ?? 0,
    ],
    queryFn: () => fetchServiceCenters(params),
  });
}
