import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import { withMock } from './mock';

type CategoryResponse = {
  id: number;
  name: string;
  name_uk?: string | null;
};

type MasterPublicResponse = {
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
  contacts: { phone: string | null };
};

type ReviewResponse = {
  id: number;
  rating: number;
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

export type MasterPublic = {
  id: number;
  publicId: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  city: string | null;
  district: string | null;
  experienceYears: number | null;
  callOutPrice: number | null;
  schedule: string | null;
  isVolunteer: boolean;
  rating: number | null;
  reviewsCount: number;
  specializations: string[];
  phone: string | null;
};

export type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
  authorFirstName: string;
  authorLastName: string;
  authorAvatarUrl: string | null;
};

export type ReviewList = {
  items: Review[];
  total: number;
};

export const REVIEWS_PREVIEW_LIMIT = 3;

export function toMasterPublic(response: MasterPublicResponse): MasterPublic {
  return {
    id: response.id,
    publicId: response.public_id,
    firstName: response.first_name,
    lastName: response.last_name,
    avatarUrl: response.avatar_url,
    city: response.city,
    district: response.district,
    experienceYears: response.experience_years,
    callOutPrice: response.call_out_price,
    schedule: response.schedule,
    isVolunteer: response.is_volunteer,
    rating: response.rating,
    reviewsCount: response.reviews_count,
    specializations: response.categories.map((category) => category.name_uk ?? category.name),
    phone: response.contacts.phone,
  };
}

export function toReview(response: ReviewResponse): Review {
  return {
    id: response.id,
    rating: response.rating,
    comment: response.comment,
    createdAt: new Date(response.created_at),
    authorFirstName: response.author_first_name,
    authorLastName: response.author_last_name,
    authorAvatarUrl: response.author_avatar_url,
  };
}

export const MOCK_MASTER_PUBLIC: MasterPublic = {
  id: 12,
  publicId: 247,
  firstName: 'Андрій',
  lastName: 'Мельник',
  avatarUrl: null,
  city: 'Львів',
  district: 'Сихівський район',
  experienceYears: 7,
  callOutPrice: 300,
  schedule: 'Пн–Сб, 9:00–19:00',
  isVolunteer: true,
  rating: 4.8,
  reviewsCount: 32,
  specializations: ['Побутова техніка', 'Електрика'],
  phone: '+380671234567',
};

export const MOCK_REVIEWS: ReviewList = {
  items: [
    {
      id: 1,
      rating: 5,
      comment: 'Швидко полагодив пральну машину, все пояснив.',
      createdAt: new Date(2026, 9, 21),
      authorFirstName: 'Ірина',
      authorLastName: 'Коваль',
      authorAvatarUrl: null,
    },
  ],
  total: 32,
};

export function fetchMasterPublic(masterId: number): Promise<MasterPublic> {
  return withMock(
    async () => toMasterPublic(await apiGet<MasterPublicResponse>(`/masters/${masterId}`)),
    () => MOCK_MASTER_PUBLIC,
  );
}

export function fetchMasterReviews(masterId: number, limit: number): Promise<ReviewList> {
  return withMock(
    async () => {
      const response = await apiGet<ReviewListResponse>(
        `/masters/${masterId}/reviews?limit=${limit}&offset=0`,
      );
      return { items: response.items.map(toReview), total: response.total };
    },
    () => MOCK_REVIEWS,
  );
}

export function useMasterPublic(masterId: number) {
  return useQuery({
    queryKey: ['masters', masterId, 'public'],
    queryFn: () => fetchMasterPublic(masterId),
  });
}

export function useMasterReviews(masterId: number) {
  return useQuery({
    queryKey: ['masters', masterId, 'reviews', REVIEWS_PREVIEW_LIMIT],
    queryFn: () => fetchMasterReviews(masterId, REVIEWS_PREVIEW_LIMIT),
  });
}