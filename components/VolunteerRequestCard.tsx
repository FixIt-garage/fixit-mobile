import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { formatShortDateTime, pluralUk } from '../src/format';
import { Card } from './Card';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';
import { Text } from './Text';

export type VolunteerRequestCardProps = {
  organization: string;
  title: string;
  date: Date;
  place: string;
  joined: number;
  needed: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function formatMastersCount(joined: number, needed: number): string {
  return `${joined} з ${needed} ${pluralUk(needed, 'майстра', 'майстрів', 'майстрів')}`;
}

export function VolunteerRequestCard({
  organization,
  title,
  date,
  place,
  joined,
  needed,
  onPress,
  style,
}: VolunteerRequestCardProps) {
  const theme = useTheme();
  const when = formatShortDateTime(date);
  const count = formatMastersCount(joined, needed);
  const progress = needed > 0 ? joined / needed : 0;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${title}, ${organization}, ${when}, ${place}, ${count}`}
      style={[styles.column, style]}
    >
      <View style={styles.row}>
        <View style={[styles.orgIcon, { backgroundColor: theme.colors.bg.successSoft }]}>
          <Icon name="heart-handshake" size={16} color="text/success" />
        </View>
        <Text variant="labelMono" color="secondary" numberOfLines={1} style={styles.shrink}>
          {organization}
        </Text>
      </View>

      <Text variant="bodyBold" numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Icon name="calendar" size={16} color="text/secondary" />
          <Text variant="bodySmall" color="secondary">
            {when}
          </Text>
        </View>
        <View style={[styles.detail, styles.shrink]}>
          <Icon name="map-pin" size={16} color="text/secondary" />
          <Text variant="bodySmall" color="secondary" numberOfLines={1} style={styles.shrink}>
            {place}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <ProgressBar value={progress} gradient="org" height={6} style={styles.bar} />
        <Text variant="labelMono" color="secondary">
          {count}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  column: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orgIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shrink: {
    flexShrink: 1,
  },
  bar: {
    flex: 1,
    width: undefined,
  },
});