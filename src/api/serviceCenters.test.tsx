import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import * as client from '../../api/client';
import {
  fetchServiceCenter,
  fetchServiceCenterReviews,
  fetchServiceCenters,
  MOCK_SERVICE_CENTER,
  MOCK_SERVICE_CENTER_REVIEWS,
  toServiceCenter,
  useServiceCenter,
  useServiceCenterReviews,
  useServiceCenters,
} from './serviceCenters';
import { setMockMode } from './mock';

jest.mock('../../api/client', () => ({
  ...jest.requireActual('../../api/client'),
  apiGet: jest.fn(),
}));

const apiGet = jest.mocked(client.apiGet);

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

const backendServiceCenter = {
  id: 18,
  public_id: 1182,
  name: 'ТехноСервіс',
  address: 'вул. Наукова, 7А',
  city: 'Львів',
  phone: '+380671234567',
  location: {
    latitude: 49.815,
    longitude: 24.023,
  },
  rating: 4.6,
  reviews_count: 58,
  opening_hours: {
    monday: { open: '09:00', close: '19:00' },
    tuesday: { open: '09:00', close: '19:00' },
    wednesday: { open: '09:00', close: '19:00' },
    thursday: { open: '09:00', close: '19:00' },
    friday: { open: '09:00', close: '19:00' },
    saturday: { open: '10:00', close: '16:00' },
    sunday: null,
  },
  is_open: true,
  working_status: 'Відчинено до 19:00',
  categories: [
    { id: 1, name: 'Smartphones', name_uk: 'Смартфони' },
    { id: 2, name: 'Laptops', name_uk: 'Ноутбуки' },
  ],
  services: [
    { id: 1, name: 'Заміна екрана', category_id: 1 },
  ],
};

describe('toServiceCenter', () => {
  it('maps backend response to the mobile model', () => {
    const result = toServiceCenter(backendServiceCenter);

    expect(result.id).toBe(18);
    expect(result.publicId).toBe(1182);
    expect(result.name).toBe('ТехноСервіс');
    expect(result.categories).toEqual([
      { id: 1, name: 'Смартфони' },
      { id: 2, name: 'Ноутбуки' },
    ]);
    expect(result.services).toEqual([
      { id: 1, name: 'Заміна екрана', categoryId: 1 },
    ]);
    expect(result.isOpen).toBe(true);
    expect(result.workingStatus).toBe('Відчинено до 19:00');
    expect(result.location?.latitude).toBe(49.815);
  });
});

describe('fetchServiceCenter', () => {
  beforeEach(() => {
    apiGet.mockReset();
    setMockMode(false);
  });

  it('loads a service center by public ID', async () => {
    apiGet.mockResolvedValueOnce(backendServiceCenter);

    const result = await fetchServiceCenter(1182);

    expect(apiGet).toHaveBeenCalledWith('/service-centers/1182');
    expect(result.publicId).toBe(1182);
    expect(result.name).toBe('ТехноСервіс');
  });

  it('returns mock data without calling the API in mock mode', async () => {
    setMockMode(true);

    const result = await fetchServiceCenter(1182);

    expect(result).toEqual(MOCK_SERVICE_CENTER);
    expect(apiGet).not.toHaveBeenCalled();
  });
});

describe('fetchServiceCenterReviews', () => {
  beforeEach(() => {
    apiGet.mockReset();
    setMockMode(false);
  });

  it('loads reviews using the internal company ID', async () => {
    apiGet.mockResolvedValueOnce({
      items: [
        {
          id: 1,
          issue_id: 10,
          master_id: null,
          company_id: 18,
          rating: 5,
          tags: [],
          comment: 'Все чудово!',
          created_at: '2026-11-10T10:00:00Z',
          author_first_name: 'Олена',
          author_last_name: 'Коваль',
          author_avatar_url: null,
        },
      ],
      total: 58,
      limit: 3,
      offset: 0,
    });

    const result = await fetchServiceCenterReviews(18);

    expect(apiGet).toHaveBeenCalledWith(
      '/service-centers/18/reviews?limit=3&offset=0',
    );
    expect(result.total).toBe(58);
    expect(result.items[0].authorFirstName).toBe('Олена');
    expect(result.items[0].createdAt).toEqual(
      new Date('2026-11-10T10:00:00Z'),
    );
  });

  it('returns mock reviews without calling the API in mock mode', async () => {
    setMockMode(true);

    const result = await fetchServiceCenterReviews(18);

    expect(result).toEqual(MOCK_SERVICE_CENTER_REVIEWS);
    expect(apiGet).not.toHaveBeenCalled();
  });
});

describe('service center query hooks', () => {
  beforeEach(() => {
    apiGet.mockReset();
    setMockMode(false);
  });

  it('loads service center through useServiceCenter', async () => {
    apiGet.mockResolvedValueOnce(backendServiceCenter);

    const { result } = await renderHook(
      () => useServiceCenter(1182),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.publicId).toBe(1182);
  });

  it('loads reviews through useServiceCenterReviews', async () => {
    apiGet.mockResolvedValueOnce({
      items: [],
      total: 0,
      limit: 3,
      offset: 0,
    });

    const { result } = await renderHook(
      () => useServiceCenterReviews(18),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.total).toBe(0);
  });
});


describe('fetchServiceCenters', () => {
  beforeEach(() => {
    apiGet.mockReset();
    setMockMode(false);
  });

  it('searches service centers with city, category and description', async () => {
    apiGet.mockResolvedValueOnce({
      items: [backendServiceCenter],
      total: 1,
      limit: 20,
      offset: 0,
    });

    const result = await fetchServiceCenters({
      city: 'Львів',
      categoryId: 1,
      query: 'Ремонт смартфона',
    });

    expect(apiGet).toHaveBeenCalledWith(
      '/search/service-centers?city=%D0%9B%D1%8C%D0%B2%D1%96%D0%B2&category_id=1&q=%D0%A0%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%20%D1%81%D0%BC%D0%B0%D1%80%D1%82%D1%84%D0%BE%D0%BD%D0%B0&sort=rating&limit=20&offset=0',
    );
    expect(result.total).toBe(1);
    expect(result.items[0].publicId).toBe(1182);
    expect(result.items[0].categories[0].name).toBe('Смартфони');
  });

  it('returns mock service centers in mock mode', async () => {
    setMockMode(true);

    const result = await fetchServiceCenters({
      city: 'Львів',
      categoryId: 1,
      query: 'Ремонт смартфона',
    });

    expect(result.items).toEqual([MOCK_SERVICE_CENTER]);
    expect(result.total).toBe(1);
    expect(apiGet).not.toHaveBeenCalled();
  });
});

describe('useServiceCenters', () => {
  beforeEach(() => {
    apiGet.mockReset();
    setMockMode(false);
  });

  it('loads search results through React Query', async () => {
    apiGet.mockResolvedValueOnce({
      items: [backendServiceCenter],
      total: 1,
      limit: 20,
      offset: 0,
    });

    const { result } = await renderHook(
      () =>
        useServiceCenters({
          city: 'Львів',
          categoryId: 1,
          query: 'Ремонт смартфона',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items[0].publicId).toBe(1182);
    expect(result.current.data?.total).toBe(1);
  });
});
