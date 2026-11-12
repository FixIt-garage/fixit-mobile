
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';

export type Status =
  | 'sent'
  | 'accepted'
  | 'inProgress'
  | 'done'
  | 'declined';

type StatusConfig = {
  label: string;
  backgroundColor: string;
  foregroundColor: string;
};

const statusConfig: Record<Status, StatusConfig> = {
  sent: {
    label: 'НАДІСЛАНА',
    backgroundColor: '#EEF0F3',
    foregroundColor: '#6B7280',
  },
  accepted: {
    label: 'ПРИЙНЯТА',
    backgroundColor: '#EFF4FF',
    foregroundColor: '#2563EB',
  },
  inProgress: {
    label: 'В РОБОТІ',
    backgroundColor: '#FFFBEB',
    foregroundColor: '#F59E0B',
  },
  done: {
    label: 'ВИКОНАНА',
    backgroundColor: '#F0FDF4',
    foregroundColor: '#16A34A',
  },
  declined: {
    label: 'ВІДХИЛЕНА',
    backgroundColor: '#FEF2F2',
    foregroundColor: '#DC2626',
  },
};

export type StatusChipProps = {
  status: Status;
};

export function StatusChip({ status }: StatusChipProps) {
  const theme = useTheme();
  const config = statusConfig[status];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderRadius: theme.radius.pill,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={config.label}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: config.foregroundColor },
        ]}
      />

      <Text
        variant="labelMonoBold"
        style={{ color: config.foregroundColor }}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 22,
    paddingLeft: 8,
    paddingRight: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
