import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../src/theme';
import { useAuth } from '../src/auth/AuthProvider';
import { useMyProfile, type Profile } from '../src/api/profile';
import { displayPhone, profileCompletion, profileMeta } from '../src/profileView';
import { Button } from '../components/Button';
import { ContactsCard } from '../components/ContactsCard';
import { ProfileCompletionCard } from '../components/ProfileCompletionCard';
import { ProfileHero } from '../components/ProfileHero';
import { Text } from '../components/Text';

const TAB_BAR_HEIGHT = 64;
const HERO_SIDE_PADDING = 16;

export type ProfileViewProps = {
  profile: Profile;
  onLogout: () => void;
  onEdit: () => void;
  onFill: () => void;
};

export function ProfileView({ profile, onLogout, onEdit, onFill }: ProfileViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const completion = profileCompletion(profile);
  const accent = profile.role === 'master' ? 'master' : 'client';

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
        stats={[
          { label: 'Заявки', value: String(profile.stats.requestsCount) },
          { label: 'Відгуки', value: String(profile.stats.reviewsCount) },
          { label: 'З нами з', value: String(profile.stats.memberSinceYear) },
        ]}
        onEdit={onEdit}
        onLogout={onLogout}
        style={{ marginHorizontal: HERO_SIDE_PADDING }}
      />

      <View style={{ paddingHorizontal: theme.layout.screenPadding, gap: theme.spacing.md }}>
        {completion ? (
          <ProfileCompletionCard
            progress={completion.progress}
            hint={completion.hint}
            gradient={accent}
            onAction={onFill}
          />
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
  const { data: profile, isPending, isError, refetch } = useMyProfile();

  const logout = () => {
    void signOut();
  };
  const notReadyYet = () => undefined;

  if (isPending) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.bg.screen }]}>
        <ActivityIndicator accessibilityLabel="Завантаження профілю" color={theme.colors.bg.brand} />
      </View>
    );
  }

  if (isError || !profile) {
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
        <Button label="Спробувати ще раз" onPress={() => void refetch()} />
        <Button label="Вийти" variant="secondary" onPress={logout} />
      </View>
    );
  }

  return (
    <ProfileView profile={profile} onLogout={logout} onEdit={notReadyYet} onFill={notReadyYet} />
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
});