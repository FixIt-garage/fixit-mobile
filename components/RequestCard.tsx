import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { formatShortDate } from '../src/format';
import { Card } from './Card';
import { Icon } from './Icon';
import { StatusChip, type Status } from './StatusChip';
import { Text } from './Text';

const STATUS_NAMES: Record<Status, string> = {
  sent: 'надіслана',
  accepted: 'прийнята',
  inProgress: 'в роботі',
  done: 'виконана',
  declined: 'відхилена',
};

export type RequestCardProps = {
  category: string;
  title: string;
  status: Status;
  date: Date;
  author?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function RequestCard({
  category,
  title,
  status,
  date,
  author,
  onPress,
  style,
}: RequestCardProps) {
  const meta = [author, formatShortDate(date)].filter(Boolean).join(' · ');

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${title}, ${category}, ${STATUS_NAMES[status]}, ${meta}`}
      style={[styles.column, style]}
    >
      <View style={styles.header}>
        <Text variant="labelMono" color="secondary" numberOfLines={1} style={styles.category}>
          {category}
        </Text>
        <StatusChip status={status} />
      </View>

      <Text variant="bodyBold" numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.meta}>
        <Icon name="user" size={16} color="text/secondary" />
        <Text variant="bodySmall" color="secondary" numberOfLines={1} style={styles.metaText}>
          {meta}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  column: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  category: {
    flexShrink: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flexShrink: 1,
  },
});