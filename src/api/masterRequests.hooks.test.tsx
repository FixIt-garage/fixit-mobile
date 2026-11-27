import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as client from '../../api/client';
import {
  MOCK_MASTER_REQUESTS,
  incomingRequestsKey,
  toMasterRequest,
  useRespondToRequest,
  type MasterRequest,
} from './masterRequests';

jest.mock('../../api/client', () => ({
  ...jest.requireActual('../../api/client'),
  apiRequest: jest.fn(),
}));

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

const apiRequest = jest.mocked(client.apiRequest);

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

function deferred<T>() {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function cachedIds(queryClient: QueryClient) {
  return queryClient
    .getQueryData<MasterRequest[]>(incomingRequestsKey(1))
    ?.map((request) => request.id);
}

describe('toMasterRequest', () => {
  it('maps the backend fields and tolerates a missing category', () => {
    expect(
      toMasterRequest({
        id: 5,
        title: 'Тече кран',
        status: 'sent',
        client_first_name: 'Ірина',
        district: null,
        time_ago: '5 хв тому',
        created_at: '2026-11-27T10:00:00Z',
      }),
    ).toEqual({
      id: 5,
      title: 'Тече кран',
      clientFirstName: 'Ірина',
      district: null,
      timeAgo: '5 хв тому',
      createdAt: new Date('2026-11-27T10:00:00Z'),
      categoryId: null,
    });
  });
});

describe('useRespondToRequest', () => {
  beforeEach(() => {
    apiRequest.mockReset();
    client.invalidateAuthSession();
  });

  it('keys the inbox by account', () => {
    expect(incomingRequestsKey(1)).not.toEqual(incomingRequestsKey(2));
  });

  it('removes the request at once and posts the decision', async () => {
    const { queryClient, wrapper } = setup();
    queryClient.setQueryData(incomingRequestsKey(1), MOCK_MASTER_REQUESTS);
    const request = deferred<unknown>();
    apiRequest.mockReturnValueOnce(request.promise as never);

    const { result } = await renderHook(() => useRespondToRequest(1), { wrapper });
    await act(async () => {
      result.current.mutate({ issueId: 41, decision: 'accept' });
    });

    await waitFor(() => expect(cachedIds(queryClient)).toEqual([42]));
    expect(apiRequest).toHaveBeenCalledWith('/issues/41/accept', { method: 'POST' });

    await act(async () => {
      request.resolve({});
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(cachedIds(queryClient)).toEqual([42]);
  });

  it('puts the request back in its place when the server fails', async () => {
    const { queryClient, wrapper } = setup();
    queryClient.setQueryData(incomingRequestsKey(1), MOCK_MASTER_REQUESTS);
    apiRequest.mockRejectedValueOnce(new Error('offline'));

    const { result } = await renderHook(() => useRespondToRequest(1), { wrapper });
    await act(async () => {
      result.current.mutate({ issueId: 41, decision: 'decline' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(apiRequest).toHaveBeenCalledWith('/issues/41/decline', { method: 'POST' });
    expect(cachedIds(queryClient)).toEqual([41, 42]);
  });
});