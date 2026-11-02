import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, type GradientName } from '../src/theme';

const HEIGHT = 8;

export type ProgressBarProps = {
    /** Прогрес від 0 до 1 */
    value: number;
    /** Колір заповнення під роль, за замовчуванням client */
    gradient?: GradientName;
    style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ value, gradient = 'client', style }: ProgressBarProps) {
    const theme = useTheme();
    // Обмежуємо значення, щоб смуга не вилазила за межі
    const clamped = Math.min(Math.max(value, 0), 1);
    const percent = Math.round(clamped * 100);

    return (
        <View
            accessible
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: percent }}
            style={[styles.track, { backgroundColor: theme.colors.bg.subtle }, style]}
        >
            <View testID="progress-fill" style={[styles.fill, { width: `${percent}%` }]}>
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
        height: HEIGHT,
        borderRadius: HEIGHT / 2,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: HEIGHT / 2,
        overflow: 'hidden',
    },
});