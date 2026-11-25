import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

// Розміри з Figma: коло 140, червоне коло 88, іконка 40 з лінією 2.5px
const HALO_SIZE = 140;
const CIRCLE_SIZE = 88;
const ICON_SIZE = 40;
// Lucide рахує товщину лінії в сітці 24×24, тому 2.5px на іконці 40 — це 1.5
const ICON_STROKE = (2.5 * 24) / ICON_SIZE;

export type ErrorStateProps = {
  title: string;
  /** Пояснення: що сталося і що робити */
  text?: string;
  /** Іконка в червоному колі, за замовчуванням circle-alert */
  icon?: IconName;
  /** Текст кнопки; кнопка показується, коли є і actionLabel, і onAction */
  actionLabel?: string;
  onAction?: () => void;
  /** Спінер на кнопці, поки йде повторна спроба */
  actionLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ErrorState({
  title,
  text,
  icon = 'circle-alert',
  actionLabel,
  onAction,
  actionLoading = false,
  style,
}: ErrorStateProps) {
  const theme = useTheme();
  const showAction = Boolean(actionLabel && onAction);

  return (
    <View style={[styles.root, { gap: theme.spacing.lg }, style]}>
      <View
        testID="error-state-illustration"
        style={[styles.halo, { backgroundColor: theme.colors.bg.errorSoft }]}
      >
        <View
          style={[styles.circle, { backgroundColor: theme.colors.text.error }]}
        >
          <Icon
            name={icon}
            size={ICON_SIZE}
            strokeWidth={ICON_STROKE}
            color="text/onInverse"
          />
        </View>
      </View>

      <Text variant="h2" accessibilityRole="header" style={styles.centered}>
        {title}
      </Text>

      {text ? (
        <Text color="secondary" style={styles.centered}>
          {text}
        </Text>
      ) : null}

      {showAction ? (
        <Button
          label={actionLabel as string}
          onPress={onAction}
          loading={actionLoading}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  halo: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
  },
});
