import { toMasterProfile } from './masterProfile';

const EMPTY_RESPONSE = {
  id: null,
  city: null,
  district: null,
  experience_years: null,
  call_out_price: null,
  schedule: null,
  is_volunteer: false,
  rating: null,
  reviews_count: 0,
  categories: [],
  completeness: { filled: 0, total: 5, percent: 0, next_field: 'categories' },
};

describe('toMasterProfile', () => {
  it('maps the backend field names', () => {
    const master = toMasterProfile({
      ...EMPTY_RESPONSE,
      id: 12,
      experience_years: 7,
      call_out_price: 300,
      rating: 4.8,
      reviews_count: 32,
      categories: [{ id: 1 }, { id: 2 }],
      completeness: { filled: 4, total: 5, percent: 80, next_field: 'schedule' },
    });

    expect(master).toMatchObject({
      id: 12,
      experienceYears: 7,
      callOutPrice: 300,
      rating: 4.8,
      reviewsCount: 32,
      categoriesCount: 2,
      completeness: { filled: 4, total: 5, percent: 80, nextField: 'schedule' },
    });
  });

  it('keeps empty values as null for a master who saved nothing', () => {
    const master = toMasterProfile(EMPTY_RESPONSE);

    expect(master.id).toBeNull();
    expect(master.experienceYears).toBeNull();
    expect(master.callOutPrice).toBeNull();
    expect(master.rating).toBeNull();
    expect(master.completeness).toEqual({ filled: 0, total: 5, percent: 0, nextField: 'categories' });
  });
});