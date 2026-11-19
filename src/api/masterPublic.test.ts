import { toMasterPublic, toReview } from './masterPublic';

const RESPONSE = {
  id: 12,
  public_id: 247,
  first_name: 'Андрій',
  last_name: 'Мельник',
  avatar_url: null,
  city: 'Львів',
  district: null,
  experience_years: null,
  call_out_price: 300,
  schedule: null,
  is_volunteer: true,
  rating: null,
  reviews_count: 0,
  categories: [
    { id: 1, name: 'Appliances', name_uk: 'Побутова техніка' },
    { id: 2, name: 'Електрика' },
  ],
  contacts: { phone: '+380671234567' },
};

describe('toMasterPublic', () => {
  it('maps the public profile and keeps empty values as null', () => {
    expect(toMasterPublic(RESPONSE)).toMatchObject({
      id: 12,
      publicId: 247,
      district: null,
      experienceYears: null,
      callOutPrice: 300,
      rating: null,
      specializations: ['Побутова техніка', 'Електрика'],
      phone: '+380671234567',
    });
  });
});

describe('toReview', () => {
  it('maps a review', () => {
    const review = toReview({
      id: 1,
      rating: 5,
      comment: null,
      created_at: '2026-10-21T10:00:00Z',
      author_first_name: 'Ірина',
      author_last_name: 'Коваль',
      author_avatar_url: null,
    });

    expect(review).toMatchObject({ id: 1, rating: 5, comment: null, authorFirstName: 'Ірина' });
    expect(review.createdAt).toBeInstanceOf(Date);
  });
});