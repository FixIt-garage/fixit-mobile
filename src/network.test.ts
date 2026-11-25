import NetInfo from '@react-native-community/netinfo';
import {
  QueryClient,
  QueryObserver,
  onlineManager,
} from '@tanstack/react-query';
import { isOffline, retryConnection } from './network';

const refresh = NetInfo.refresh as jest.Mock;

const online = { isConnected: true, isInternetReachable: true };
const offline = { isConnected: false, isInternetReachable: false };

describe('isOffline', () => {
  it('is offline without a network or without internet', () => {
    expect(isOffline({ isConnected: false, isInternetReachable: null })).toBe(
      true,
    );
    expect(isOffline({ isConnected: true, isInternetReachable: false })).toBe(
      true,
    );
  });

  it('is online while internet reachability is still unknown', () => {
    expect(isOffline({ isConnected: true, isInternetReachable: null })).toBe(
      false,
    );
    expect(isOffline({ isConnected: null, isInternetReachable: null })).toBe(
      false,
    );
    expect(isOffline(online)).toBe(false);
  });
});

describe('retryConnection', () => {
  let client: QueryClient;

  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  afterEach(() => {
    client.clear();
    onlineManager.setOnline(true);
  });

  it('refetches failed queries when the internet is back', async () => {
    const queryFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network request failed'))
      .mockResolvedValue(['Сантехніка']);

    // Спостерігач робить запит «активним», як на відкритому екрані
    const observer = new QueryObserver(client, {
      queryKey: ['categories'],
      queryFn,
    });
    const unsubscribe = observer.subscribe(() => undefined);
    await waitFor(
      () => client.getQueryState(['categories'])?.status === 'error',
    );

    refresh.mockResolvedValueOnce(online);
    await expect(retryConnection(client)).resolves.toBe(true);

    expect(queryFn).toHaveBeenCalledTimes(2);
    expect(client.getQueryData(['categories'])).toEqual(['Сантехніка']);
    unsubscribe();
  });

  it('does not refetch while still offline', async () => {
    const refetch = jest.spyOn(client, 'refetchQueries');
    refresh.mockResolvedValueOnce(offline);

    await expect(retryConnection(client)).resolves.toBe(false);
    expect(refetch).not.toHaveBeenCalled();
  });
});

async function waitFor(condition: () => boolean) {
  for (let i = 0; i < 50; i += 1) {
    if (condition()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error('condition was not met');
}
