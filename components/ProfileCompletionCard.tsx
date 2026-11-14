import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { GradientName } from '../src/theme';
import { Card } from './Card';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';
import { Text } from './Text';

export type ProfileCompletionCardProps = {
  progress: number;
  hint: string;
  actionLabel?: string;
  onAction: () => void;
  gradient?: GradientName;
  style?: StyleProp<ViewStyle>;
};

export function ProfileCompletionCard({
  progress,
  hint,
  actionLabel = 'Заповнити зараз',
  onAction,
  gradient = 'client',
  style,
}: ProfileCompletionCardProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const percent = Math.round(clamped * 100);

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <Text variant="labelMono" color="secondary">
          Профіль заповнено
        </Text>
        <Text variant="labelMonoBold" color="brand">
          {`${percent}%`}
        </Text>
      </View>

      <ProgressBar value={clamped} gradient={gradient} />

      <Text variant="bodySmall" color="secondary">
        {hint}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        onPress={onAction}
        hitSlop={8}
        style={({ pressed }) => [styles.link, pressed && styles.pressed]}
      >
        <Text variant="bodyBold" color="brand">
          {actionLabel}
        </Text>
        <Icon name="chevron-right" size={16} color="text/brand" strokeWidth={1.5} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  pressed: {
    opacity: 0.6,
  },
});