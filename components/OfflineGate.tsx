import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import OfflineScreen from '../screens/OfflineScreen';
import { retryConnection, useIsOffline } from '../src/network';

export type OfflineGateProps = {
  children: ReactNode;
};

/**
 * Показує екран «Немає з'єднання» поверх застосунку, коли зникає інтернет.
 * Застосунок під ним лишається змонтованим, тож відкритий екран і введені дані
 * нікуди не діваються: після повернення з'єднання людина продовжує з того ж місця.
 */
export function OfflineGate({ children }: OfflineGateProps) {
  const offline = useIsOffline();
  const queryClient = useQueryClient();
  const [retrying, setRetrying] = useState(false);

  const retry = async () => {
    setRetrying(true);
    try {
      await retryConnection(queryClient);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <View style={styles.root}>
      <View
        style={styles.root}
        // Поки показано офлайн-екран, вміст під ним не читає скрінрідер
        importantForAccessibility={offline ? 'no-hide-descendants' : 'auto'}
        accessibilityElementsHidden={offline}
      >
        {children}
      </View>
      {offline ? (
        <View style={StyleSheet.absoluteFill}>
          <OfflineScreen onRetry={() => void retry()} retrying={retrying} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
