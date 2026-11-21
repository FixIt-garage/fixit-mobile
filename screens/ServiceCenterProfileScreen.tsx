import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { ApiError } from '../api/client';
import {
  useServiceCenter,
  useServiceCenterReviews,
  type OpeningHours,
  type ServiceCenterReview,
  type ServiceCenter,
} from '../src/api/serviceCenters';
import { useTheme } from '../src/theme';
import { colors as themeColors } from '../src/theme/colors';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { NutRating } from '../components/NutRating';
import { Text } from '../components/Text';

type Props = NativeStackScreenProps<MainStackParamList, 'ServiceCenterProfile'>;

type ServiceCenterProfileViewProps = {
  center: ServiceCenter;
  onBack: () => void;
  onCall: () => void;
  reviews?: ServiceCenterReview[];
};

const MAP_HEIGHT = 330;
const SHEET_TOP = 294; // аркуш перекриває карту на 36 px

const MAP_STYLE = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: themeColors.bg.subtle }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: themeColors.bg.surface }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: themeColors.border.default }],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: themeColors.bg.subtle }],
  },
  {
    featureType: 'park',
    elementType: 'geometry',
    stylers: [{ color: themeColors.bg.successSoft }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: themeColors.bg.subtle }],
  },
];

function formatTime(time: string) {
  return time.replace(/^0/, '');
}

function formatOpeningHours(openingHours: OpeningHours | null): string | null {
  if (!openingHours) return null;

  const days = [
    ['Пн', openingHours.monday],
    ['Вт', openingHours.tuesday],
    ['Ср', openingHours.wednesday],
    ['Чт', openingHours.thursday],
    ['Пт', openingHours.friday],
    ['Сб', openingHours.saturday],
    ['Нд', openingHours.sunday],
  ] as const;

  const parts = days.flatMap(([label, hours]) =>
    hours
      ? [`${label} ${formatTime(hours.open)}–${formatTime(hours.close)}`]
      : [],
  );

  return parts.length > 0 ? parts.join(' · ') : null;
}

function ServiceCenterMap({
  center,
  onBack,
}: {
  center: ServiceCenter;
  onBack: () => void;
}) {
  const theme = useTheme();
  const location = center.location;

  return (
    <View style={styles.mapContainer} testID="service-center-map">
      {location ? (
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          }}
          customMapStyle={MAP_STYLE}
          mapType="standard"
          toolbarEnabled={false}
          showsCompass={false}
          showsScale={false}
          rotateEnabled={false}
          pitchEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          testID="service-center-real-map"
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges
            testID="service-center-marker"
          >
            <View
              style={[styles.mapLabel, { transform: [{ translateY: -30 }] }]}
            >
              <View style={styles.mapMarkerIcon}>
                <Icon
                  name="store"
                  size={16}
                  color="text/onBrand"
                  strokeWidth={2}
                />
              </View>
              <Text style={styles.mapLabelText} numberOfLines={1}>
                {center.name}
              </Text>
            </View>
          </Marker>
        </MapView>
      ) : (
        <View style={styles.mapUnavailable}>
          <Text variant="bodySmall" color="secondary">
            Місцезнаходження центру не вказано
          </Text>
        </View>
      )}

      <View style={styles.statusTime} pointerEvents="none">
        <Text style={styles.statusTimeText}>9:41</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={onBack}
        style={({ pressed }) => [
          styles.backButton,
          { borderColor: theme.colors.border.default },
          pressed && styles.backButtonPressed,
        ]}
      >
        <Icon
          name="chevron-left"
          size={20}
          color="text/primary"
          strokeWidth={1.75}
        />
      </Pressable>
    </View>
  );
}

function ProfileInfoRow({
  icon,
  text,
}: {
  icon: 'map-pin' | 'clock' | 'phone';
  text: string;
}) {
  return (
    <View style={styles.profileInfoRow}>
      <Icon
        name={icon}
        size={20}
        color={icon === 'map-pin' ? 'text/primary' : 'text/secondary'}
        strokeWidth={1.75}
      />
      <Text
        variant="body"
        color="primary"
        numberOfLines={1}
        style={styles.profileInfoText}
      >
        {text}
      </Text>
    </View>
  );
}

export function ServiceCenterProfileView({
  center,
  onBack,
  onCall,
  reviews = [],
}: ServiceCenterProfileViewProps) {
  const theme = useTheme();

  const openingHoursText = formatOpeningHours(center.openingHours);
  const addressText = [center.city, center.address].filter(Boolean).join(', ');

  const infoRows = [
    ...(addressText ? [{ icon: 'map-pin' as const, text: addressText }] : []),
    ...(openingHoursText
      ? [{ icon: 'clock' as const, text: openingHoursText }]
      : []),
    ...(center.phone ? [{ icon: 'phone' as const, text: center.phone }] : []),
  ];

  return (
    <View style={styles.screen}>
      <StatusBar hidden />

      <ServiceCenterMap center={center} onBack={onBack} />

      <View
        style={[styles.sheet, { backgroundColor: theme.colors.bg.surface }]}
      >
        <View style={styles.handle} />

        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.identity}>
            <Text variant="labelMono" color="secondary">
              {`СЕРВІСНИЙ ЦЕНТР · ID ${String(center.publicId).padStart(4, '0')}`}
            </Text>

            <Text
              variant="h1"
              accessibilityRole="header"
              numberOfLines={1}
              style={styles.title}
            >
              {center.name}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.ratingDetails}>
              {center.rating !== null ? (
                <NutRating mode="display" rating={center.rating} size={44} />
              ) : (
                <View style={styles.ratingPlaceholder} />
              )}

              <Text variant="bodySmall" color="secondary">
                {`${center.reviewsCount} відгуків`}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: center.isOpen
                    ? themeColors.bg.successSoft
                    : theme.colors.bg.subtle,
                },
              ]}
            >
              <Text
                variant="labelMonoBold"
                style={{
                  color: center.isOpen
                    ? themeColors.text.success
                    : theme.colors.text.secondary,
                  textTransform: 'uppercase',
                }}
              >
                {center.workingStatus}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRows}>
            {infoRows.map((row) => (
              <ProfileInfoRow key={row.icon} icon={row.icon} text={row.text} />
            ))}
          </View>

          {reviews.length > 0 ? (
            <View style={styles.servicesSection}>
              <Text variant="labelMono" color="secondary">
                ВІДГУКИ
              </Text>

              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text variant="body" color="primary">
                      {`${review.authorFirstName} ${review.authorLastName}`}
                    </Text>
                    <Text variant="bodySmall" color="secondary">
                      {`★ ${review.rating}/5`}
                    </Text>
                  </View>
                  {review.comment ? (
                    <Text variant="bodySmall" color="secondary">
                      {review.comment}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {center.services.length > 0 ? (
            <View style={styles.servicesSection}>
              <Text variant="labelMono" color="secondary">
                ПОСЛУГИ
              </Text>

              <View style={styles.servicesGrid}>
                {center.services.map((service) => (
                  <View key={service.id} style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>{service.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.callButtonContainer}>
          {center.phone ? (
            <Button
              label="Подзвонити"
              gradient="client"
              onPress={onCall}
              style={styles.callButton}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function ServiceCenterProfileScreen({
  navigation,
  route,
}: Props) {
  const theme = useTheme();
  const { serviceCenterId } = route.params;
  const centerQuery = useServiceCenter(serviceCenterId);
  const reviewsQuery = useServiceCenterReviews(centerQuery.data?.id ?? 0);

  const goBack = () => navigation.goBack();

  if (centerQuery.isPending) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.bg.screen }]}
      >
        <ActivityIndicator
          accessibilityLabel="Завантаження профілю"
          color={theme.colors.bg.brand}
        />
      </View>
    );
  }

  if (centerQuery.isError) {
    const notFound =
      centerQuery.error instanceof ApiError && centerQuery.error.status === 404;

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
          {notFound
            ? 'Сервісний центр не знайдено'
            : 'Не вдалося завантажити профіль'}
        </Text>

        {!notFound ? (
          <Button
            label="Спробувати ще раз"
            onPress={() => void centerQuery.refetch()}
          />
        ) : null}

        <Button label="Назад" variant="secondary" onPress={goBack} />
      </View>
    );
  }

  return (
    <ServiceCenterProfileView
      center={centerQuery.data}
      reviews={reviewsQuery.data?.items}
      onBack={goBack}
      onCall={() => {
        const phone = centerQuery.data.phone;
        if (phone) {
          void Linking.openURL(`tel:${phone.replace(/[^\d+]/g, '')}`);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: themeColors.bg.subtle,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },

  /* ---------- Карта (завжди 330 px) ---------- */
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: MAP_HEIGHT,
    overflow: 'hidden',
    backgroundColor: themeColors.bg.subtle,
  },
  mapUnavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.bg.subtle,
  },
  statusTime: {
    position: 'absolute',
    top: 4,
    left: 20,
  },
  statusTimeText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 12,
    lineHeight: 16,
    color: themeColors.text.primary,
  },
  backButton: {
    position: 'absolute',
    top: 36,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    backgroundColor: themeColors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.75,
  },
  mapLabel: {
    height: 40,
    maxWidth: 260,
    paddingTop: 6,
    paddingRight: 14,
    paddingBottom: 6,
    paddingLeft: 6,
    borderRadius: 999,
    backgroundColor: themeColors.text.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 5,
    shadowColor: themeColors.text.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
  },
  mapMarkerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: themeColors.role.center,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLabelText: {
    color: themeColors.bg.surface,
    fontFamily: 'Onest_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },

  /* ---------- Аркуш (від y = 294 до низу екрана) ---------- */
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 506,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    paddingTop: 12,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: themeColors.border.default,
    marginBottom: 12,
  },
  sheetScroll: {
    flex: 1,
  },
  sheetContent: {
    paddingHorizontal: 20,
  },
  identity: {
    gap: 12,
  },
  title: {
    maxWidth: 185,
  },
  ratingRow: {
    marginTop: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingPlaceholder: {
    width: 44,
    height: 44,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  divider: {
    height: 1,
    marginTop: 16,
    backgroundColor: themeColors.border.default,
  },
  infoRows: {
    marginTop: 16,
    gap: 14,
  },
  profileInfoRow: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileInfoText: {
    flex: 1,
  },
  servicesSection: {
    marginTop: 20,
    gap: 10,
  },
  reviewItem: {
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.default,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    alignSelf: 'flex-start',
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: themeColors.roleSoft.center,
    justifyContent: 'center',
  },
  serviceChipText: {
    color: themeColors.role.center,
    fontFamily: 'Onest_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  callButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  callButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
  },
});
