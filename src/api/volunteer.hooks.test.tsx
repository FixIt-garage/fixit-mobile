import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';
import * as client from '../../api/client';
import { useNearbyVolunteerRequests } from './volunteer';

jest.mock('../../api/client', () => ({
  ...jest.requireActual('../../api/client'),
  apiGet: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const apiGet = jest.mocked(client.apiGet);

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNearbyVolunteerRequests', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('does not load requests from all over the country when the city is unknown', async () => {
    const { result } = await renderHook(() => useNearbyVolunteerRequests(1, null, true), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(apiGet).not.toHaveBeenCalled();
  });

  it('does not load requests for a master who is not a volunteer', async () => {
    const { result } = await renderHook(() => useNearbyVolunteerRequests(1, 'Львів', false), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(apiGet).not.toHaveBeenCalled();
  });
});
