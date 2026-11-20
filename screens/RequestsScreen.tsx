import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  MainStackParamList,
  MainTabParamList,
} from '../navigation/AppNavigator';
import { useMemo, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { ChipGroup, type ChipOption } from '../components/ChipGroup';
import { Icon } from '../components/Icon';
import { RequestCard } from '../components/RequestCard';
import { issueStatusToChipStatus, type Status } from '../components/StatusChip';
import { Text } from '../components/Text';

import { fetchIssues, type IssueCounts } from '../src/api/issues';
import { useCategories } from '../src/api/categories';
import { useTheme } from '../src/theme';

const PAGE_SIZE = 20;

type RequestFilter = 'all' | 'active' | 'done';

const FILTER_OPTIONS: readonly ChipOption<RequestFilter>[] = [
  { value: 'all', label: 'Усі' },
  { value: 'active', label: 'Активні' },
  { value: 'done', label: 'Виконані' },
];

export default function RequestsScreen() {
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        BottomTabNavigationProp<MainTabParamList, 'requests'>,
        NativeStackNavigationProp<MainStackParamList>
      >
    >();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [filter, setFilter] = useState<RequestFilter>('all');
  const queryClient = useQueryClient();

  const categoriesQuery = useCategories();

  const issuesQuery = useInfiniteQuery({
    queryKey: ['issues', 'requests-tab', filter],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchIssues({
        limit: PAGE_SIZE,
        offset: pageParam,
        statusGroup: filter === 'all' ? undefined : filter,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.items.length === PAGE_SIZE
        ? allPages.reduce((total, page) => total + page.items.length, 0)
        : undefined,
  });

  const allIssues = useMemo(
    () => issuesQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [issuesQuery.data],
  );

  const counts = useMemo(
  () =>
    issuesQuery.data?.pages[0]?.counts ??
    queryClient.getQueryData<{ pages: { counts: IssueCounts }[] }>([
      'issues',
      'requests-tab',
      'all',
    ])?.pages[0]?.counts ?? {
      all: 0,
      active: 0,
      done: 0,
    },
  [issuesQuery.data, queryClient],
  );

  const filterOptions = useMemo(
    () =>
      FILTER_OPTIONS.map((option) => ({
        ...option,
        label: `${option.label} · ${counts[option.value]}`,
      })),
    [counts],
  );

  const categories = categoriesQuery.data ?? [];

  const handleRefresh = () => {
    void Promise.all([issuesQuery.refetch(), categoriesQuery.refetch()]);
  };

  const renderEmptyState = () => {
    if (issuesQuery.isLoading) {
      return (
        <ActivityIndicator
          color={theme.colors.text.brand}
          style={styles.loader}
        />
      );
    }

    if (issuesQuery.isError) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="secondary">
            Не вдалося завантажити заявки.
          </Text>

          <Button
            label="Спробувати ще раз"
            variant="secondary"
            onPress={() => void issuesQuery.refetch()}
          />
        </View>
      );
    }

    if (allIssues.length === 0 && counts.all > 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="secondary">
            За цим фільтром заявок немає.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <View
          style={[
            styles.emptyIllustrationOuter,
            { backgroundColor: theme.colors.bg.brandSoft },
          ]}
        >
          <View
            style={[
              styles.emptyIllustrationInner,
              { backgroundColor: theme.colors.bg.brand },
            ]}
          >
            <Icon
              name="clipboard-list"
              size={40}
              color="text/onBrand"
              strokeWidth={1.75}
            />
          </View>
        </View>

        <Text variant="h2" color="primary" style={styles.emptyTitle}>
          Поки що заявок немає
        </Text>

        <Text variant="body" color="secondary" style={styles.emptyDescription}>
          Опишіть, що зламалося, — і ми підберемо майстра чи сервіс поруч.
        </Text>

        <Button
          label="Створити заявку"
          style={styles.createRequestButton}
          onPress={() => navigation.navigate('home')}
        />
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.bg.screen }]}
    >
      <View
        style={[
          styles.topHeader,
          {
            backgroundColor: theme.colors.bg.surface,
            paddingTop: insets.top + theme.spacing.lg,
            paddingHorizontal: theme.layout.screenPadding,
          },
        ]}
      >
        <Text variant="h1" color="primary">
          Мої заявки
        </Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={allIssues}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            const category = categories.find(
              (entry) => entry.id === item.category_id,
            );

            const status: Status | null = issueStatusToChipStatus[item.status];

            if (!status) {
              return null;
            }

            return (
              <RequestCard
                category={category?.name ?? 'Категорія'}
                title={item.title}
                date={new Date(item.created_at)}
                status={status}
                onPress={() =>
                  navigation.navigate('RequestDetails', {
                    issueId: item.id,
                    title: item.title,
                  })
                }
              />
            );
          }}
          ListHeaderComponent={
            counts.all > 0 ? (
              <View style={styles.filters}>
                <ChipGroup
                  mode="single"
                  options={filterOptions}
                  value={filter}
                  onChange={setFilter}
                />
              </View>
            ) : undefined
          }
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => (
            <View style={{ height: theme.spacing.md }} />
          )}
          ListFooterComponent={
            issuesQuery.isFetchingNextPage ? (
              <ActivityIndicator
                color={theme.colors.text.brand}
                style={styles.footerLoader}
              />
            ) : undefined
          }
          onEndReached={() => {
            if (issuesQuery.hasNextPage && !issuesQuery.isFetchingNextPage) {
              void issuesQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={
                issuesQuery.isRefetching && !issuesQuery.isFetchingNextPage
              }
              onRefresh={handleRefresh}
              tintColor={theme.colors.text.brand}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: 110 + insets.bottom,
            },
            allIssues.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  filters: {
    marginBottom: 12,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyListContent: {
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 48,
    paddingHorizontal: 12,
  },
  emptyState: {
    width: '100%',
    maxWidth: 296,
    alignSelf: 'center',
    alignItems: 'center',
  },
  emptyIllustrationOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIllustrationInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 24,
    textAlign: 'center',
  },
  emptyDescription: {
    marginTop: 12,
    textAlign: 'center',
  },
  createRequestButton: {
    width: '100%',
    marginTop: 24,
    borderRadius: 28,
  },
  loader: {
    marginTop: 48,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
