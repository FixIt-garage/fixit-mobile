import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as client from '../../api/client';
import { MOCK_MASTER_PROFILE, myMasterProfileKey, useSetVolunteer } from './masterProfile';

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

const OLD_RESPONSE = {
    id: 12,
    city: 'Львів',
    district: null,
    experience_years: 7,
    call_out_price: 300,
    schedule: null,
    is_volunteer: false,
    rating: 4.8,
    reviews_count: 32,
    categories: [],
    completeness: { filled: 2, total: 5, percent: 40, next_field: 'categories' },
};

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
    let resolve: (value: T) => void = () => { };
    let reject: (error: unknown) => void = () => { };
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

describe('useSetVolunteer across sessions', () => {
    beforeEach(() => {
        apiRequest.mockReset();
        client.invalidateAuthSession();
    });

    it('keys the own master profile by account', () => {
        expect(myMasterProfileKey(1)).not.toEqual(myMasterProfileKey(2));
    });

    it('ignores a late success from the previous session', async () => {
        const { queryClient, wrapper } = setup();
        const key = myMasterProfileKey(1);
        queryClient.setQueryData(key, MOCK_MASTER_PROFILE);
        const request = deferred<unknown>();
        apiRequest.mockReturnValueOnce(request.promise as never);

        const { result } = await renderHook(() => useSetVolunteer(1), { wrapper });

        await act(async () => {
            result.current.mutate(false);
        });

        client.invalidateAuthSession();
        queryClient.clear();
        const fresh = { ...MOCK_MASTER_PROFILE, isVolunteer: true, reviewsCount: 40 };
        queryClient.setQueryData(key, fresh);

        await act(async () => {
            request.resolve(OLD_RESPONSE);
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(queryClient.getQueryData(key)).toEqual(fresh);
    });

    it('ignores a late rollback from the previous session', async () => {
        const { queryClient, wrapper } = setup();
        const key = myMasterProfileKey(1);
        queryClient.setQueryData(key, MOCK_MASTER_PROFILE);
        const request = deferred<unknown>();
        apiRequest.mockReturnValueOnce(request.promise as never);

        const { result } = await renderHook(() => useSetVolunteer(1), { wrapper });

        await act(async () => {
            result.current.mutate(false);
        });

        client.invalidateAuthSession();
        queryClient.clear();
        const fresh = { ...MOCK_MASTER_PROFILE, isVolunteer: false, reviewsCount: 40 };
        queryClient.setQueryData(key, fresh);

        await act(async () => {
            request.reject(new client.ApiError(500, null));
        });
        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(queryClient.getQueryData(key)).toEqual(fresh);
    });

    it('updates the cache when the session did not change', async () => {
        const { queryClient, wrapper } = setup();
        const key = myMasterProfileKey(1);
        queryClient.setQueryData(key, MOCK_MASTER_PROFILE);
        apiRequest.mockResolvedValueOnce(OLD_RESPONSE as never);

        const { result } = await renderHook(() => useSetVolunteer(1), { wrapper });

        await act(async () => {
            result.current.mutate(false);
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(queryClient.getQueryData(key)).toMatchObject({ isVolunteer: false });
    });
    it('ignores a late success after an automatic sign-out', async () => {
        const { queryClient, wrapper } = setup();
        const key = myMasterProfileKey(1);
        queryClient.setQueryData(key, MOCK_MASTER_PROFILE);
        const request = deferred<unknown>();
        apiRequest.mockReturnValueOnce(request.promise as never);

        const { result } = await renderHook(() => useSetVolunteer(1), { wrapper });

        await act(async () => {
            result.current.mutate(false);
        });

        process.env.EXPO_PUBLIC_API_URL = 'https://api.test';
        globalThis.fetch = jest.fn(async () => ({
            ok: false,
            status: 401,
            json: async () => null,
        })) as unknown as typeof fetch;
        const actualClient = jest.requireActual<typeof client>('../../api/client');

        await expect(actualClient.apiRequest('/requests')).rejects.toBeInstanceOf(client.ApiError);

        queryClient.clear();
        const fresh = { ...MOCK_MASTER_PROFILE, isVolunteer: true, reviewsCount: 40 };
        queryClient.setQueryData(key, fresh);

        await act(async () => {
            request.resolve(OLD_RESPONSE);
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(queryClient.getQueryData(key)).toEqual(fresh);
    });
});