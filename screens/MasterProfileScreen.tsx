import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { ApiError } from '../api/client';
import { useTheme } from '../src/theme';
import {
  useMasterPublic,
  useMasterReviews,
  type MasterPublic,
  type Review,
} from '../src/api/masterPublic';
import { formatPrice, formatYears } from '../src/format';
import { formatPublicId } from '../src/profileView';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { IconName } from '../components/Icon/Icon';
import { InfoRow } from '../components/InfoRow';
import { MasterHero } from '../components/MasterHero';
import type { ProfileStat } from '../components/HeroStats';
import { NutRating } from '../components/NutRating';
import { ReviewCard } from '../components/ReviewCard';
import { Text } from '../components/Text';

type Props = NativeStackScreenProps<MainStackParamList, 'MasterProfile'>;

const HERO_SIDE_PADDING = 16;
const ACTION_BAR_BOTTOM = 20;
const EMPTY_VALUE = '—';

function heroStats(master: MasterPublic): ProfileStat[] {
  return [
    {
      label: 'Рейтинг',
      value:
        master.rating !== null ? (
          <NutRating mode="display" rating={master.rating} size={32} />
        ) : (
          EMPTY_VALUE
        ),
    },
    { label: 'Відгуки', value: String(master.reviewsCount) },
    {
      label: 'Досвід',
      value: master.experienceYears !== null ? formatYears(master.experienceYears) : EMPTY_VALUE,
    },
  ];
}

function infoRows(master: MasterPublic): { icon: IconName; text: string }[] {
  const rows: { icon: IconName; text: string }[] = [];
  const location = [master.city, master.district].filter(Boolean).join(', ');
  if (location) {
    rows.push({ icon: 'map-pin', text: location });
  }
  if (master.schedule) {
    rows.push({ icon: 'clock', text: master.schedule });
  }
  if (master.callOutPrice !== null) {
    rows.push({ icon: 'wrench', text: `Виклик — від ${formatPrice(master.callOutPrice)} ₴` });
  }
  return rows;
}

export type MasterProfileViewProps = {
  master: MasterPublic;
  reviews: Review[];
  reviewsTotal: number;
  onBack: () => void;
  onSendRequest: () => void;
  onAllReviews: () => void;
};

export function MasterProfileView({
  master,
  reviews,
  reviewsTotal,
  onBack,
  onSendRequest,
  onAllReviews,
}: MasterProfileViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const rows = infoRows(master);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: theme.spacing.lg,
          gap: theme.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MasterHero
          name={`${master.firstName} ${master.lastName}`}
          meta={`Майстер · ${formatPublicId(master.publicId)}`}
          specializations={master.specializations.join(' · ')}
          volunteer={master.isVolunteer}
          avatarUri={master.avatarUrl ?? undefined}
          stats={heroStats(master)}
          onBack={onBack}
          style={{ marginHorizontal: HERO_SIDE_PADDING }}
        />

        <View style={{ paddingHorizontal: theme.layout.screenPadding, gap: theme.spacing.md }}>
          {rows.length > 0 ? (
            <Card style={styles.infoCard}>
              {rows.map((row) => (
                <InfoRow key={row.icon} icon={row.icon} text={row.text} />
              ))}
            </Card>
          ) : null}

          <View style={styles.reviewsHeader}>
            <Text variant="labelMono" color="secondary">
              {`Відгуки · ${reviewsTotal}`}
            </Text>
            {reviewsTotal > reviews.length ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Усі відгуки"
                onPress={onAllReviews}
                hitSlop={8}
              >
                <Text variant="bodyBold" style={{ color: theme.colors.role.master }}>
                  Усі
                </Text>
              </Pressable>
            ) : null}
          </View>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.authorFirstName}
                rating={review.rating}
                text={review.comment ?? undefined}
              />
            ))
          ) : (
            <Card>
              <Text variant="bodySmall" color="secondary">
                Поки що відгуків немає
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: theme.colors.bg.screen,
          paddingTop: theme.spacing.md,
          paddingHorizontal: theme.layout.screenPadding,
          paddingBottom: Math.max(insets.bottom, ACTION_BAR_BOTTOM),
        }}
      >
        <Button label="Надіслати заявку" onPress={onSendRequest} />
      </View>
    </View>
  );
}

export default function MasterProfileScreen({ navigation, route }: Props) {
  const { masterId } = route.params;
  const theme = useTheme();
  const masterQuery = useMasterPublic(masterId);
  const reviewsQuery = useMasterReviews(masterId);
  const goBack = () => navigation.goBack();
  const notReadyYet = () => undefined;

  if (masterQuery.isError) {
    const notFound = masterQuery.error instanceof ApiError && masterQuery.error.status === 404;
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: theme.colors.bg.screen,
            padding: theme.layout.screenPadding,
            gap: theme.spacing.md,
          },
        ]}
      >
        <Text variant="h2" style={styles.centerText}>
          {notFound ? 'Майстра не знайдено' : 'Не вдалося завантажити профіль'}
        </Text>
        {notFound ? null : (
          <Button label="Спробувати ще раз" onPress={() => void masterQuery.refetch()} />
        )}
        <Button label="Назад" variant="secondary" onPress={goBack} />
      </View>
    );
  }

  if (masterQuery.isPending) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.bg.screen }]}>
        <ActivityIndicator accessibilityLabel="Завантаження профілю" color={theme.colors.bg.brand} />
      </View>
    );
  }

  return (
    <MasterProfileView
      master={masterQuery.data}
      reviews={reviewsQuery.data?.items ?? []}
      reviewsTotal={reviewsQuery.data?.total ?? masterQuery.data.reviewsCount}
      onBack={goBack}
      onSendRequest={notReadyYet}
      onAllReviews={notReadyYet}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  infoCard: {
    gap: 12,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
});