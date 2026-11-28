import { useEffect, useState } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { onlineManager, type QueryClient } from '@tanstack/react-query';

/**
 * Немає з'єднання: телефон не підключений до мережі або мережа є, але інтернет недоступний.
 * `isInternetReachable` спочатку `null` (ще не перевірено) — тоді вважаємо, що інтернет є.
 */
export function isOffline(
  state: Pick<NetInfoState, 'isConnected' | 'isInternetReachable'>,
) {
  return state.isConnected === false || state.isInternetReachable === false;
}

/**
 * Передає TanStack Query стан мережі з NetInfo: без інтернету запити стають на паузу,
 * а коли з'єднання повертається — автоматично продовжуються.
 */
export function connectQueryOnlineManager() {
  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => setOnline(!isOffline(state))),
  );
}

/** `true`, поки немає з'єднання. Оновлюється, щойно змінюється стан мережі. */
export function useIsOffline() {
  const [offline, setOffline] = useState(false);

  useEffect(
    () => NetInfo.addEventListener((state) => setOffline(isOffline(state))),
    [],
  );

  return offline;
}

/**
 * Кнопка «Спробувати ще раз»: ще раз перевіряє мережу і, якщо інтернет є,
 * повторює запити, що впали або стояли на паузі. Повертає `true`, якщо з'єднання є.
 */
export async function retryConnection(client: QueryClient) {
  const state = await NetInfo.refresh();

  if (isOffline(state)) {
    return false;
  }

  onlineManager.setOnline(true);
  await client.refetchQueries({
    type: 'active',
    predicate: (query) =>
      query.state.status === 'error' || query.state.fetchStatus === 'paused',
  });

  return true;
}
