import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from './Text';
import { OfflineGate } from './OfflineGate';

const addEventListener = NetInfo.addEventListener as jest.Mock;
const refresh = NetInfo.refresh as jest.Mock;

type Listener = (state: Partial<NetInfoState>) => void;
let emitNetworkState: Listener = () => undefined;

const online = { isConnected: true, isInternetReachable: true };
const offline = { isConnected: false, isInternetReachable: false };

async function renderGate() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  await render(
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <OfflineGate>
          <Text>Головна клієнта</Text>
        </OfflineGate>
      </QueryClientProvider>
    </SafeAreaProvider>,
  );
  return client;
}

async function setNetwork(state: Partial<NetInfoState>) {
  await act(async () => emitNetworkState(state));
}

describe('OfflineGate', () => {
  beforeEach(() => {
    addEventListener.mockImplementation((listener: Listener) => {
      emitNetworkState = listener;
      return jest.fn();
    });
  });

  it('shows the app while online', async () => {
    await renderGate();
    await setNetwork(online);

    expect(screen.getByText('Головна клієнта')).toBeTruthy();
    expect(screen.queryByTestId('offline-screen')).toBeNull();
  });

  it('shows screen 22 on top of the app when the connection drops and hides it when it returns', async () => {
    await renderGate();

    await setNetwork(offline);
    expect(
      screen.getByRole('header', { name: "Немає з'єднання" }),
    ).toBeTruthy();
    // Екран під ним лишається змонтованим, тому введені дані не губляться
    expect(
      screen.getByText('Головна клієнта', { includeHiddenElements: true }),
    ).toBeTruthy();

    await setNetwork(online);
    expect(screen.queryByTestId('offline-screen')).toBeNull();
  });

  it('retries and refetches when «Спробувати ще раз» is pressed', async () => {
    const client = await renderGate();
    const refetch = jest.spyOn(client, 'refetchQueries');
    await setNetwork(offline);

    refresh.mockImplementationOnce(async () => {
      emitNetworkState(online);
      return online;
    });
    await fireEvent.press(
      screen.getByRole('button', { name: 'Спробувати ще раз' }),
    );

    expect(refresh).toHaveBeenCalled();
    expect(refetch).toHaveBeenCalled();
    expect(screen.queryByTestId('offline-screen')).toBeNull();
  });

  it('stays on screen 22 if the internet is still missing', async () => {
    const client = await renderGate();
    const refetch = jest.spyOn(client, 'refetchQueries');
    await setNetwork(offline);

    refresh.mockResolvedValueOnce(offline);
    await fireEvent.press(
      screen.getByRole('button', { name: 'Спробувати ще раз' }),
    );

    expect(refetch).not.toHaveBeenCalled();
    expect(screen.getByTestId('offline-screen')).toBeTruthy();
  });
});
