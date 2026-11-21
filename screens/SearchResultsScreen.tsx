import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { useServiceCenters } from '../src/api/serviceCenters';
import { useTheme } from '../src/theme';
import { BackBar } from '../components/BackBar';
import { Button } from '../components/Button';
import { ServiceCard } from '../components/ServiceCard';
import { Text } from '../components/Text';

type Props = NativeStackScreenProps<MainStackParamList, 'SearchResults'>;

export default function SearchResultsScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { city, categoryId, description } = route.params;

  const { data, isLoading, isError, refetch, isRefetching } = useServiceCenters(
    {
      city,
      categoryId,
      query: '',
    },
  );

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}
      edges={['left', 'right', 'bottom']}
    >
      <BackBar title="Результати пошуку" />

      <View style={styles.content}>
        <View style={styles.heading}>
          <Text variant="h3">Сервісні центри</Text>
          <Text variant="bodySmall" color="secondary">
            {[city, description].filter(Boolean).join(' · ')}
          </Text>
          {data ? (
            <Text variant="bodySmall" color="secondary">
              Знайдено: {data.total}
            </Text>
          ) : null}
        </View>

        {isLoading ? (
          <View style={styles.state}>
            <ActivityIndicator
              size="large"
              color={theme.colors.bg.brand}
              accessibilityLabel="Завантаження сервісних центрів"
            />
            <Text variant="bodySmall" color="secondary">
              Шукаємо сервісні центри...
            </Text>
          </View>
        ) : isError ? (
          <View style={styles.state}>
            <Text variant="bodyBold">Не вдалося завантажити результати</Text>
            <Text variant="bodySmall" color="secondary">
              Перевірте з’єднання та спробуйте ще раз.
            </Text>
            <Button
              label="Спробувати ще раз"
              variant="secondary"
              loading={isRefetching}
              onPress={() => refetch()}
              style={styles.actionButton}
            />
          </View>
        ) : data && data.items.length === 0 ? (
          <View style={styles.state}>
            <Text variant="bodyBold">Сервісних центрів не знайдено</Text>
            <Text variant="bodySmall" color="secondary">
              Спробуйте змінити місто або опис проблеми.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {data?.items.map((center) => (
              <ServiceCard
                key={center.id}
                name={center.name}
                address={[center.address, center.city]
                  .filter(Boolean)
                  .join(', ')}
                rating={center.rating ?? 0}
                hours={center.workingStatus ?? undefined}
                onPress={() =>
                  navigation.navigate('ServiceCenterProfile', {
                    serviceCenterId: center.publicId,
                    draftDescription: description,
                  })
                }
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 20,
  },
  heading: {
    gap: 6,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  actionButton: {
    marginTop: 8,
  },
});
