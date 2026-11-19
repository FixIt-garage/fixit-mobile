import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Avatar } from './Avatar';
import { GlassIconButton } from './GlassIconButton';
import { HeroCard } from './HeroCard';
import { HeroStats, type ProfileStat } from './HeroStats';
import { getInitials } from './MasterCard';
import { Text } from './Text';
import { VolunteerBadge } from './VolunteerBadge';

export type MasterHeroProps = {
  name: string;
  meta: string;
  specializations?: string;
  volunteer?: boolean;
  avatarUri?: string;
  stats: ProfileStat[];
  onBack: () => void;
  style?: StyleProp<ViewStyle>;
};

export function MasterHero({
  name,
  meta,
  specializations,
  volunteer = false,
  avatarUri,
  stats,
  onBack,
  style,
}: MasterHeroProps) {
  return (
    <HeroCard accent="master" style={style}>
      <View style={styles.topRow}>
        <GlassIconButton icon="chevron-left" accessibilityLabel="Назад" onPress={onBack} />
        <Text variant="labelMono" color="onInverseMuted" numberOfLines={1} style={styles.grow}>
          {meta}
        </Text>
        {volunteer ? <VolunteerBadge /> : null}
      </View>

      <View style={styles.identityRow}>
        <Avatar
          initials={getInitials(name)}
          uri={avatarUri}
          gradient="master"
          size={72}
          radius={21.6}
        />
        <View style={styles.identity}>
          <Text variant="h2" color="onInverse" numberOfLines={2} accessibilityRole="header">
            {name}
          </Text>
          {specializations ? (
            <Text variant="bodySmall" color="onInverseMuted" numberOfLines={2}>
              {specializations}
            </Text>
          ) : null}
        </View>
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
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  identity: {
    flex: 1,
    gap: 4,
  },
});