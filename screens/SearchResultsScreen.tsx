import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { BackBar } from '../components/BackBar';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { MasterCard } from '../components/MasterCard';
import { SegmentedControl, type SegmentOption } from '../components/SegmentedControl';
import { ServiceCard } from '../components/ServiceCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Text } from '../components/Text';
import { useCategories } from '../src/api/categories';
import {
  useSearchMasters,
  useSearchServiceCenters,
  type MasterSearchItem,
  type ServiceCenterSearchItem,
} from '../src/api/search';
import { pluralUk } from '../src/format';
import { useTheme } from '../src/theme';

type Props = NativeStackScreenProps<MainStackParamList, 'SearchResults'>;

export type ResultsTab = 'masters' | 'services';

export type SearchResultsState = 'loading' | 'error' | 'ready';

type ResultRow =
  | { kind: 'master'; item: MasterSearchItem }
  | { kind: 'service'; item: ServiceCenterSearchItem };

const TAB_OPTIONS: readonly SegmentOption<ResultsTab>[] = [
  { value: 'masters', label: 'Майстри' },
  { value: 'services', label: 'Сервіси' },
];

const SKELETON_OPACITIES = [1, 0.82, 0.64, 0.46];

export function formatFound(tab: ResultsTab, total: number): string {
  const noun =
    tab === 'masters'
      ? pluralUk(total, 'майстра', 'майстри', 'майстрів')
      : pluralUk(total, 'сервіс', 'сервіси', 'сервісів');
  return `Знайдено ${total} ${noun}`;
}

export type SearchResultsViewProps = {
  title: string;
  subtitle: string;
  tab: ResultsTab;
  onTabChange: (tab: ResultsTab) => void;
  masters: MasterSearchItem[];
  services: ServiceCenterSearchItem[];
  total: number;
  state: SearchResultsState;
  loadingMore?: boolean;
  refreshing?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  onRetry: () => void;
  onOpenMaster: (masterId: number) => void;
  onBack?: () => void;
};

export function SearchResultsView({
  title,
  subtitle,
  tab,
  onTabChange,
  masters,
  services,
  total,
  state,
  loadingMore = false,
  refreshing = false,
  onEndReached,
  onRefresh,
  onRetry,
  onOpenMaster,
  onBack,
}: SearchResultsViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const rows = useMemo<ResultRow[]>(
    () =>
      tab === 'masters'
        ? masters.map((item): ResultRow => ({ kind: 'master', item }))
        : services.map((item): ResultRow => ({ kind: 'service', item })),
    [tab, masters, services],
  );

  const renderRow = ({ item: row }: { item: ResultRow }) => {
    if (row.kind === 'master') {
      const master = row.item;
      return (
        <MasterCard
          name={`${master.firstName} ${master.lastName}`}
          specialization={master.specializations.join(', ') || 'Майстер'}
          rating={master.rating}
          reviewsCount={master.reviewsCount}
          volunteer={master.isVolunteer}
          avatarUri={master.avatarUrl ?? undefined}
          onPress={() => onOpenMaster(master.id)}
        />
      );
    }

    const center = row.item;
    return (
      <ServiceCard
        name={center.name}
        address={center.address ?? center.city ?? undefined}
        rating={center.rating}
        hours={center.workingStatus}
        open={center.isOpen}
      />
    );
  };

  const renderEmpty = () => {
    if (state === 'loading') {
      return (
        <View style={{ gap: theme.spacing.md }}>
          {SKELETON_OPACITIES.map((opacity) => (
            <SkeletonCard key={opacity} opacity={opacity} />
          ))}
          <Text variant="bodySmall" color="secondary" style={styles.centerText}>
            {tab === 'masters' ? 'Шукаємо майстрів поруч…' : 'Шукаємо сервіси поруч…'}
          </Text>
        </View>
      );
    }

    if (state === 'error') {
      return (
        <View style={[styles.message, { gap: theme.spacing.lg }]}>
          <Text variant="body" color="secondary" style={styles.centerText}>
            Не вдалося завантажити результати.
          </Text>
          <Button label="Спробувати ще раз" variant="secondary" onPress={onRetry} />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <View style={[styles.emptyOuter, { backgroundColor: theme.colors.bg.brandSoft }]}>
          <View style={[styles.emptyInner, { backgroundColor: theme.colors.bg.brand }]}>
            <Icon name="search" size={40} color="text/onBrand" strokeWidth={1.75} />
          </View>
        </View>
        <Text variant="h2" style={[styles.centerText, { marginTop: theme.spacing.xl }]}>
          Нікого не знайшли
        </Text>
        <Text
          variant="body"
          color="secondary"
          style={[styles.centerText, { marginTop: theme.spacing.md }]}
        >
          {tab === 'masters'
            ? 'Спробуйте іншу категорію або подивіться сервіси.'
            : 'Спробуйте іншу категорію або подивіться майстрів.'}
        </Text>
      </View>
    );
  };

  const showSummary = state === 'ready' && rows.length > 0;
  const listData = state === 'ready' ? rows : [];
  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}>
      <BackBar title={title} subtitle={subtitle} onBack={onBack} />

      <View
        style={{
          paddingHorizontal: theme.layout.screenPadding,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
        }}
      >
        <SegmentedControl options={TAB_OPTIONS} value={tab} onChange={onTabChange} />
      </View>

      <FlatList
        data={listData}
        keyExtractor={(row) => `${row.kind}-${row.item.id}`}
        renderItem={renderRow}
        ListHeaderComponent={
          showSummary ? (
            <View style={[styles.summary, { marginBottom: theme.spacing.md }]}>
              <Text variant="bodySmall" color="secondary">
                {formatFound(tab, total)}
              </Text>
              <Text variant="bodySmall" color="secondary">
                За рейтингом
              </Text>
            </View>
          ) : undefined
        }
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.md }} />}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={theme.colors.text.brand} style={styles.footerLoader} />
          ) : undefined
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.text.brand}
            />
          ) : undefined
        }
        contentContainerStyle={[
          {
            flexGrow: 1,
            paddingHorizontal: theme.layout.screenPadding,
            paddingBottom: insets.bottom + theme.spacing.xl,
          },
          state !== 'loading' && listData.length === 0 && styles.centered,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default function SearchResultsScreen({ navigation, route }: Props) {
  const { city, categoryId, description } = route.params;
  const [tab, setTab] = useState<ResultsTab>('masters');

  const params = useMemo(() => ({ city, categoryId }), [city, categoryId]);
  const mastersQuery = useSearchMasters(params, tab === 'masters');
  const servicesQuery = useSearchServiceCenters(params, tab === 'services');
  const categoriesQuery = useCategories();

  const categoryName = categoriesQuery.data?.find((category) => category.id === categoryId)?.name;
  const active = tab === 'masters' ? mastersQuery : servicesQuery;

  const masters = useMemo(
    () => mastersQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [mastersQuery.data],
  );
  const services = useMemo(
    () => servicesQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [servicesQuery.data],
  );

  const state: SearchResultsState = active.isLoading
    ? 'loading'
    : active.isError
      ? 'error'
      : 'ready';

  return (
    <SearchResultsView
      title={description.trim() || 'Результати пошуку'}
      subtitle={[city, categoryName].filter(Boolean).join(' · ')}
      tab={tab}
      onTabChange={setTab}
      masters={masters}
      services={services}
      total={active.data?.pages[0]?.total ?? 0}
      state={state}
      loadingMore={active.isFetchingNextPage}
      refreshing={active.isRefetching && !active.isFetchingNextPage}
      onEndReached={() => {
        if (active.hasNextPage && !active.isFetchingNextPage) {
          void active.fetchNextPage();
        }
      }}
      onRefresh={() => void active.refetch()}
      onRetry={() => void active.refetch()}
      onOpenMaster={(masterId) => navigation.navigate('MasterProfile', { masterId })}
      onBack={() => navigation.goBack()}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  message: {
    alignItems: 'center',
  },
  emptyState: {
    width: '100%',
    maxWidth: 296,
    alignSelf: 'center',
    alignItems: 'center',
  },
  emptyOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
  },
});