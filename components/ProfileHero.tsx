import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Avatar } from './Avatar';
import { GlassIconButton } from './GlassIconButton';
import { HeroCard, type HeroCardAccent } from './HeroCard';
import { HeroStats, type ProfileStat } from './HeroStats';
import { getInitials } from './MasterCard';
import { Text } from './Text';

export type { ProfileStat } from './HeroStats';

const AVATAR_SIZE = 72;
const AVATAR_RADIUS = 21.6;

export type ProfileHeroProps = {
  role: HeroCardAccent;
  name: string;
  meta: string;
  stats: ProfileStat[];
  avatarUri?: string;
  onEdit: () => void;
  onLogout: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ProfileHero({
  role,
  name,
  meta,
  stats,
  avatarUri,
  onEdit,
  onLogout,
  style,
}: ProfileHeroProps) {
  return (
    <HeroCard accent={role} style={style}>
      <View style={styles.topRow}>
        <Text variant="labelMono" color="onInverseMuted" style={styles.grow}>
          Мій профіль
        </Text>
        <GlassIconButton icon="pencil" accessibilityLabel="Редагувати профіль" onPress={onEdit} />
        <GlassIconButton icon="log-out" accessibilityLabel="Вийти" onPress={onLogout} />
      </View>

      <Avatar
        initials={getInitials(name)}
        uri={avatarUri}
        gradient={role}
        size={AVATAR_SIZE}
        radius={AVATAR_RADIUS}
      />

      <View style={styles.identity}>
        <Text variant="h2" color="onInverse" numberOfLines={2} accessibilityRole="header">
          {name}
        </Text>
        <Text variant="labelMono" color="onInverseMuted" numberOfLines={1}>
          {meta}
        </Text>
      </View>

      <HeroStats stats={stats} />
    </HeroCard>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  grow: {
    flex: 1,
  },
  identity: {
    gap: 4,
  },
});