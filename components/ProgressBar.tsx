import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, type GradientName } from '../src/theme';

const DEFAULT_HEIGHT = 8;

export type ProgressBarProps = {
  /** Прогрес від 0 до 1 */
  value: number;
  /** Колір заповнення під роль, за замовчуванням client */
  gradient?: GradientName;
  /** Висота смуги, за замовчуванням 8 */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({
  value,
  gradient = 'client',
  height = DEFAULT_HEIGHT,
  style,
}: ProgressBarProps) {
  const theme = useTheme();
  // Обмежуємо значення, щоб смуга не вилазила за межі
  const clamped = Math.min(Math.max(value, 0), 1);
  const percent = Math.round(clamped * 100);
  const radius = height / 2;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={[
        styles.track,
        { height, borderRadius: radius, backgroundColor: theme.colors.bg.subtle },
        style,
      ]}
    >
      <View
        testID="progress-fill"
        style={[styles.fill, { width: `${percent}%`, borderRadius: radius }]}
      >
        <LinearGradient
          colors={theme.gradients[gradient]}
          start={theme.gradientDirection.start}
          end={theme.gradientDirection.end}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
});