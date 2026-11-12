import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import * as client from '../../api/client';
import { fetchCategories, MOCK_CATEGORIES, useCategories } from './categories';
import { setMockMode } from './mock';

jest.mock('../../api/client', () => ({
  ...jest.requireActual('../../api/client'),
  apiGet: jest.fn(),
}));

const apiGet = jest.mocked(client.apiGet);

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useCategories', () => {
  beforeEach(() => {
    apiGet.mockReset();
    setMockMode(false);
  });

  it('loads categories from the API and prefers the Ukrainian name', async () => {
    apiGet.mockResolvedValueOnce([
      { id: 1, name: 'Appliances', slug: 'appliances', name_uk: 'Побутова техніка', parent_id: null, sort_order: 1 },
      { id: 2, name: 'Plumbing', slug: null, name_uk: null, parent_id: null, sort_order: 2 },
    ]);

    const { result } = await renderHook(() => useCategories(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([
      { id: 1, name: 'Побутова техніка', parentId: null },
      { id: 2, name: 'Plumbing', parentId: null },
    ]);
  });
});

describe('mock mode', () => {
  beforeEach(() => apiGet.mockReset());
  afterEach(() => setMockMode(false));

  it('returns mock categories without calling the API', async () => {
    setMockMode(true);

    await expect(fetchCategories()).resolves.toEqual(MOCK_CATEGORIES);
    expect(apiGet).not.toHaveBeenCalled();
  });
});