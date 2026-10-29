import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getHealth } from '../api/health';
import { theme } from '../src/theme';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHealth();
      setBackendStatus(response.status);
    } catch (err) {
      setBackendStatus(null);
      setError(
        err instanceof Error
          ? err.message
          : 'Не вдалося підключитися до backend.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadHealth() {
      try {
        const response = await getHealth();

        if (isActive) {
          setBackendStatus(response.status);
          setError(null);
        }
      } catch (err) {
        if (isActive) {
          setBackendStatus(null);
          setError(
            err instanceof Error
              ? err.message
              : 'Не вдалося підключитися до backend.',
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadHealth();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FixIt</Text>
      <Text style={styles.subtitle}>Сервіс ремонту — завжди поруч</Text>

      <View style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Статус backend</Text>

        {loading ? (
          <View style={styles.statusRow}>
            <ActivityIndicator />
            <Text style={styles.statusText}>Перевіряємо з&apos;єднання...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>Backend недоступний: {error}</Text>
        ) : (
          <Text style={styles.successText}>
            Backend відповідає. Статус: {backendStatus}
          </Text>
        )}

        <View style={styles.retryButton}>
          <Button
            title="Перевірити ще раз"
            onPress={() => void checkHealth()}
            disabled={loading}
          />
        </View>
      </View>

      <View style={styles.profileButton}>
        <Button
          title="Відкрити профіль"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  statusCard: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    flexShrink: 1,
  },
  successText: {
    color: theme.colors.text.success,
  },
  errorText: {
    color: theme.colors.text.error,
  },
  retryButton: {
    marginTop: 16,
  },
  profileButton: {
    marginTop: 20,
  },
});