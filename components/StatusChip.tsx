import { StyleSheet, View } from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';

export type Status =
  | 'sent'
  | 'accepted'
  | 'inProgress'
  | 'done'
  | 'declined';

export type BackendIssueStatus =
  | 'sent'
  | 'accepted'
  | 'in_progress'
  | 'done'
  | 'declined'
  | 'cancelled';

export const issueStatusToChipStatus: Record<
  BackendIssueStatus,
  Status | null
> = {
  sent: 'sent',
  accepted: 'accepted',
  in_progress: 'inProgress',
  done: 'done',
  declined: 'declined',
  cancelled: null,
};

type StatusConfig = {
  label: string;
  backgroundColor: string;
  foregroundColor: string;
};

const statusLabels: Record<Status, string> = {
  sent: 'НАДІСЛАНА',
  accepted: 'ПРИЙНЯТА',
  inProgress: 'В РОБОТІ',
  done: 'ВИКОНАНА',
  declined: 'ВІДХИЛЕНА',
};

export type StatusChipProps = {
  status: Status;
};

export function StatusChip({ status }: StatusChipProps) {
  const theme = useTheme();

  const statusColors: Record<
    Status,
    Omit<StatusConfig, 'label'>
  > = {
    sent: {
      backgroundColor: theme.colors.bg.subtle,
      foregroundColor: theme.colors.text.secondary,
    },
    accepted: {
      backgroundColor: theme.colors.bg.brandSoft,
      foregroundColor: theme.colors.text.brand,
    },
    inProgress: {
      backgroundColor: theme.colors.bg.warningSoft,
      foregroundColor: theme.colors.text.warning,
    },
    done: {
      backgroundColor: theme.colors.bg.successSoft,
      foregroundColor: theme.colors.text.success,
    },
    declined: {
      backgroundColor: theme.colors.bg.errorSoft,
      foregroundColor: theme.colors.text.error,
    },
  };

  const config: StatusConfig = {
    label: statusLabels[status],
    ...statusColors[status],
  };

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
