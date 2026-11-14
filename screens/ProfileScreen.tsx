import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../src/theme';
import { useAuth } from '../src/auth/AuthProvider';
import { useMyProfile, type Profile } from '../src/api/profile';
import {
  useMyMasterProfile,
  useSetVolunteer,
  type MasterProfile,
} from '../src/api/masterProfile';
import { formatYears } from '../src/format';
import { displayPhone, profileCompletion, profileMeta } from '../src/profileView';
import { Button } from '../components/Button';
import { ContactsCard } from '../components/ContactsCard';
import { NutRating } from '../components/NutRating';
import { ProfileCompletionCard } from '../components/ProfileCompletionCard';
import { ProfileHero, type ProfileStat } from '../components/ProfileHero';
import { Text } from '../components/Text';
import { VolunteerCard } from '../components/VolunteerCard';

const TAB_BAR_HEIGHT = 64;
const HERO_SIDE_PADDING = 16;
const EMPTY_VALUE = '—';

function clientStats(profile: Profile): ProfileStat[] {
  return [
    { label: 'Заявки', value: String(profile.stats.requestsCount) },
    { label: 'Відгуки', value: String(profile.stats.reviewsCount) },
    { label: 'З нами з', value: String(profile.stats.memberSinceYear) },
  ];
}

function masterStats(master: MasterProfile): ProfileStat[] {
  return [
    {
      label: 'Рейтинг',
      value:
        master.rating !== null ? (
          <View style={styles.ratingCell}>
            <NutRating mode="display" rating={master.rating} size={32} />
          </View>
        ) : (
          EMPTY_VALUE
        ),
    },
    { label: 'Відгуки', value: String(master.reviewsCount) },
    {
      label: 'Досвід',
      value: master.yearsOfExperience !== null ? formatYears(master.yearsOfExperience) : EMPTY_VALUE,
    },
  ];
}

export type ProfileViewProps = {
  profile: Profile;
  master?: MasterProfile | null;
  onVolunteerChange?: (value: boolean) => void;
  onLogout: () => void;
  onEdit: () => void;
  onFill: () => void;
};

export function ProfileView({
  profile,
  master,
  onVolunteerChange,
  onLogout,
  onEdit,
  onFill,
}: ProfileViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isMaster = profile.role === 'master' && Boolean(master);
  const accent = profile.role === 'master' ? 'master' : 'client';
  const completion = profileCompletion(profile, master);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.bg.screen }}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom:
          TAB_BAR_HEIGHT + Math.max(insets.bottom, theme.layout.bottomInset) + theme.spacing.lg,
        gap: theme.spacing.md,
      }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      <ProfileHero
        role={accent}
        name={`${profile.firstName} ${profile.lastName}`}
        meta={profileMeta(profile)}
        avatarUri={profile.avatarUrl ?? undefined}
        stats={isMaster && master ? masterStats(master) : clientStats(profile)}
        onEdit={onEdit}
        onLogout={onLogout}
        style={{ marginHorizontal: HERO_SIDE_PADDING }}
      />

      <View style={{ paddingHorizontal: theme.layout.screenPadding, gap: theme.spacing.md }}>
        {completion ? (
          <ProfileCompletionCard
            progress={completion.progress}
            hint={completion.hint}
            accent={accent}
            onAction={onFill}
          />
        ) : null}

        {isMaster && master && onVolunteerChange ? (
          <VolunteerCard value={master.isVolunteer} onChange={onVolunteerChange} />
        ) : null}

        <ContactsCard
          phone={profile.phone ? displayPhone(profile.phone) : null}
          email={profile.email}
          address={profile.address}
        />
      </View>
    </ScrollView>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { signOut } = useAuth();
  const profileQuery = useMyProfile();
  const profile = profileQuery.data;
  const isMaster = profile?.role === 'master';
  const masterQuery = useMyMasterProfile(profile?.id, isMaster);
  const setVolunteer = useSetVolunteer(profile?.id);

  const logout = () => {
    void signOut();
  };
  const notReadyYet = () => undefined;

  const isPending = profileQuery.isPending || (isMaster && masterQuery.isPending);
  const isError = profileQuery.isError || (isMaster && masterQuery.isError);

  if (isError) {
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
          Не вдалося завантажити профіль
        </Text>
        <Button
          label="Спробувати ще раз"
          onPress={() => {
            void profileQuery.refetch();
            if (isMaster) {
              void masterQuery.refetch();
            }
          }}
        />
        <Button label="Вийти" variant="secondary" onPress={logout} />
      </View>
    );
  }

  if (isPending || !profile) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.bg.screen }]}>
        <ActivityIndicator accessibilityLabel="Завантаження профілю" color={theme.colors.bg.brand} />
      </View>
    );
  }

  return (
    <ProfileView
      profile={profile}
      master={isMaster ? masterQuery.data : null}
      onVolunteerChange={(value) => setVolunteer.mutate(value)}
      onLogout={logout}
      onEdit={notReadyYet}
      onFill={notReadyYet}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  ratingCell: {
    height: 32,
    justifyContent: 'center',
  },
});