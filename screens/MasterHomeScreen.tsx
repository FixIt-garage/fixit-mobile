import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../src/auth/AuthProvider';
import { useCategories, type Category } from '../src/api/categories';
import { useMyMasterProfile } from '../src/api/masterProfile';
import {
  useFailedDecisionIds,
  useIncomingRequests,
  usePendingDecisionIds,
  useRespondToRequest,
  visibleRequests,
  type MasterRequest,
} from '../src/api/masterRequests';
import { useNearbyVolunteerRequests, type VolunteerRequest } from '../src/api/volunteer';
import { pluralUk } from '../src/format';
import { timeGreeting } from '../src/greeting';
import { useTheme } from '../src/theme';
import { BottomSheet, BOTTOM_SHEET_RADIUS } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { GreetingHeader } from '../components/GreetingHeader';
import { RequestCard } from '../components/RequestCard';
import { Text } from '../components/Text';
import { VolunteerRequestCard } from '../components/VolunteerRequestCard';

const TAB_BAR_HEIGHT = 64;
export const RESPOND_ERROR = 'Не вдалося оновити заявку. Спробуйте ще раз.';

export type LoadState = 'loading' | 'error' | 'ready';

export function newRequestsTitle(count: number): string {
  if (count === 0) {
    return 'Нових заявок немає';
  }
  return `${count} ${pluralUk(count, 'нова заявка', 'нові заявки', 'нових заявок')}`;
}

export function requestMeta(request: MasterRequest): string {
  return [request.clientFirstName, request.district, request.timeAgo].filter(Boolean).join(' · ');
}

function loadState(query: { data: unknown; isError: boolean }): LoadState {
  if (query.data !== undefined) {
    return 'ready';
  }
  return query.isError ? 'error' : 'loading';
}

type IncomingRequestCardProps = {
  request: MasterRequest;
  category: string;
  failed: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

function IncomingRequestCard({
  request,
  category,
  failed,
  onAccept,
  onDecline,
}: IncomingRequestCardProps) {
  const theme = useTheme();

  return (
    <Card style={[styles.incoming, { padding: 0, paddingBottom: theme.spacing.lg, gap: theme.spacing.md }]}>
      <RequestCard
        category={category}
        title={request.title}
        status="sent"
        date={request.createdAt}
        meta={requestMeta(request)}
      />
      {failed ? (
        <Text
          variant="bodySmall"
          color="error"
          accessibilityRole="alert"
          style={{ paddingHorizontal: theme.spacing.lg }}
        >
          {RESPOND_ERROR}
        </Text>
      ) : null}
      <View style={[styles.actions, { gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg }]}>
        <Button label="Відхилити" variant="secondary" onPress={onDecline} style={styles.action} />
        <Button label="Прийняти" gradient="master" onPress={onAccept} style={styles.action} />
      </View>
    </Card>
  );
}

function RetryCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  const theme = useTheme();

  return (
    <Card style={{ gap: theme.spacing.sm }}>
      <Text variant="bodySmall" color="secondary">
        {message}
      </Text>
      <Pressable accessibilityRole="button" onPress={onRetry} hitSlop={8}>
        <Text variant="bodyBold" style={{ color: theme.colors.role.master }}>
          Спробувати ще раз
        </Text>
      </Pressable>
    </Card>
  );
}

export type MasterHomeViewProps = {
  firstName: string;
  now: Date;
  requests: MasterRequest[];
  requestsState: LoadState;
  categories: Category[];
  onRetryRequests: () => void;
  onAccept: (issueId: number) => void;
  onDecline: (issueId: number) => void;
  failedRequestIds?: number[];
  showVolunteer: boolean;
  volunteerRequests: VolunteerRequest[];
  volunteerState: LoadState;
  onRetryVolunteer: () => void;
  volunteerNeedsCity?: boolean;
  onFillCity?: () => void;
};

export function MasterHomeView({
  firstName,
  now,
  requests,
  requestsState,
  categories,
  onRetryRequests,
  onAccept,
  onDecline,
  failedRequestIds = [],
  showVolunteer,
  volunteerRequests,
  volunteerState,
  onRetryVolunteer,
  volunteerNeedsCity = false,
  onFillCity,
}: MasterHomeViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const title = requestsState === 'ready' ? newRequestsTitle(requests.length) : 'Нові заявки';

  const categoryName = (categoryId: number | null) =>
    categoryId === null
      ? ''
      : (categories.find((category) => category.id === categoryId)?.name ?? '');

  const renderRequests = () => {
    if (requestsState === 'loading') {
      return (
        <ActivityIndicator
          accessibilityLabel="Завантаження заявок"
          color={theme.colors.role.master}
          style={styles.loader}
        />
      );
    }

    if (requestsState === 'error') {
      return <RetryCard message="Не вдалося завантажити заявки" onRetry={onRetryRequests} />;
    }

    if (requests.length === 0) {
      return (
        <Card>
          <Text variant="bodySmall" color="secondary">
            Щойно клієнт надішле вам заявку, вона зʼявиться тут.
          </Text>
        </Card>
      );
    }

    return requests.map((request) => (
      <IncomingRequestCard
        key={request.id}
        request={request}
        category={categoryName(request.categoryId)}
        onAccept={() => onAccept(request.id)}
        onDecline={() => onDecline(request.id)}
        failed={failedRequestIds.includes(request.id)}
      />
    ));
  };

  const renderVolunteer = () => {
    if (volunteerNeedsCity) {
      return (
        <Card style={{ gap: theme.spacing.sm }}>
          <Text variant="bodySmall" color="secondary">
            Вкажіть місто в профілі, щоб бачити волонтерські запити поруч.
          </Text>
          {onFillCity ? (
            <Pressable accessibilityRole="button" onPress={onFillCity} hitSlop={8}>
              <Text variant="bodyBold" style={{ color: theme.colors.role.master }}>
                Заповнити
              </Text>
            </Pressable>
          ) : null}
        </Card>
      );
    }

    if (volunteerState === 'loading') {
      return (
        <ActivityIndicator
          accessibilityLabel="Завантаження волонтерських запитів"
          color={theme.colors.role.master}
          style={styles.loader}
        />
      );
    }

    if (volunteerState === 'error') {
      return (
        <RetryCard message="Не вдалося завантажити волонтерські запити" onRetry={onRetryVolunteer} />
      );
    }

    if (volunteerRequests.length === 0) {
      return (
        <Card>
          <Text variant="bodySmall" color="secondary">
            Поруч поки немає волонтерських запитів.
          </Text>
        </Card>
      );
    }

    return volunteerRequests.map((request) => (
      <VolunteerRequestCard
        key={request.id}
        organization={request.organizationName}
        title={request.title}
        date={request.eventDate}
        place={request.place}
        joined={request.joined}
        needed={request.needed}
      />
    ));
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <GreetingHeader
          kicker={timeGreeting(firstName, now)}
          title={title}
          accent="master"
          overlap={BOTTOM_SHEET_RADIUS}
        />

        <BottomSheet
          style={[
            styles.sheet,
            {
              paddingBottom:
                TAB_BAR_HEIGHT + Math.max(insets.bottom, theme.layout.bottomInset) + theme.spacing.lg,
            },
          ]}
        >
          <View style={{ paddingTop: theme.spacing.md, gap: theme.spacing.md }}>
            {renderRequests()}

            {showVolunteer ? (
              <>
                <Text variant="h3" style={{ marginTop: theme.spacing.sm }}>
                  Волонтерські запити поруч
                </Text>
                {renderVolunteer()}
              </>
            ) : null}
          </View>
        </BottomSheet>
      </ScrollView>
    </View>
  );
}

export default function MasterHomeScreen() {
  const { state } = useAuth();
  const user = state.status === 'signedIn' ? state.user : null;
  const userId = user?.id;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const masterQuery = useMyMasterProfile(userId, userId !== undefined);
  const categoriesQuery = useCategories();
  const requestsQuery = useIncomingRequests(userId);
  const respond = useRespondToRequest(userId);
  const pendingIds = usePendingDecisionIds(userId);
  const failedIds = useFailedDecisionIds(userId);
  const showVolunteer = masterQuery.data?.isVolunteer === true;
  const city = masterQuery.data?.city ?? null;
  const volunteerQuery = useNearbyVolunteerRequests(userId, city, showVolunteer);

  return (
    <MasterHomeView
      firstName={user?.firstName ?? ''}
      now={new Date()}
      requests={visibleRequests(requestsQuery.data ?? [], pendingIds)}
      requestsState={loadState(requestsQuery)}
      categories={categoriesQuery.data ?? []}
      onRetryRequests={() => void requestsQuery.refetch()}
      onAccept={(issueId) => respond.mutate({ issueId, decision: 'accept' })}
      onDecline={(issueId) => respond.mutate({ issueId, decision: 'decline' })}
      failedRequestIds={failedIds}
      showVolunteer={showVolunteer}
      volunteerRequests={volunteerQuery.data?.items ?? []}
      volunteerState={loadState(volunteerQuery)}
      onRetryVolunteer={() => void volunteerQuery.refetch()}
      volunteerNeedsCity={showVolunteer && !city}
      onFillCity={() => navigation.navigate('MasterProfileSetup')}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  sheet: {
    flex: 1,
    marginTop: -BOTTOM_SHEET_RADIUS,
  },
  loader: {
    paddingVertical: 24,
  },
  incoming: {
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    flex: 1,
  },
});