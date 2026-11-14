import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { Avatar } from './Avatar';
import { GlassIconButton } from './GlassIconButton';
import { HeroCard, type HeroCardAccent } from './HeroCard';
import { getInitials } from './MasterCard';
import { Text } from './Text';

const AVATAR_SIZE = 72;
const AVATAR_RADIUS = 21.6;

export type ProfileStat = {
  label: string;
  value: ReactNode;
};

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
  const theme = useTheme();

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

      <View style={[styles.divider, { backgroundColor: theme.colors.glass.divider }]} />

            <View style={styles.stats}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <View style={styles.valueCell}>
              {typeof stat.value === 'string' || typeof stat.value === 'number' ? (
                <Text variant="h2" color="onInverse" style={styles.statValue} numberOfLines={1}>
                  {stat.value}
                </Text>
              ) : (
                stat.value
              )}
            </View>
            <Text variant="labelMono" color="onInverseMuted" numberOfLines={1}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
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
  divider: {
    height: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    gap: 6,
  },
  statValue: {
    lineHeight: 32,
  },
  valueCell: {
    height: 32,
    justifyContent: 'center',
  },
});