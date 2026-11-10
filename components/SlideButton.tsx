import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, type GradientName } from '../src/theme';
import { Text } from './Text';
import { Icon, type IconColor } from './Icon/Icon';

const HEIGHT = 64;
const KNOB = 52;
const INSET = 6;
const CONFIRM_AT = 0.85;

export type SlideButtonProps = {
  label: string;
  onConfirm: () => void;
  gradient?: GradientName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SlideButton({
  label,
  onConfirm,
  gradient = 'client',
  disabled = false,
  style,
}: SlideButtonProps) {
  const theme = useTheme();
  const [maxX, setMaxX] = useState(0);
  const [done, setDone] = useState(false);
  const offset = useSharedValue(0);
  const confirmed = useSharedValue(false);

  const textColor = disabled ? 'disabled' : 'onBrand';
  const iconColor: IconColor = disabled ? 'text/disabled' : 'text/brand';
  const handleConfirmed = () => {
    setDone(true);
    onConfirm();
  };

  const pan = Gesture.Pan()
    .enabled(!disabled && !done && maxX > 0)
    .onUpdate((event) => {
      offset.set(Math.min(Math.max(event.translationX, 0), maxX));
    })
    .onEnd((_event, success) => {
      if (success && !confirmed.get() && offset.get() >= maxX * CONFIRM_AT) {
        confirmed.set(true);
        offset.set(withTiming(maxX, { duration: 300, easing: Easing.out(Easing.cubic) }));
        scheduleOnRN(handleConfirmed);
      } else if (!confirmed.get()) {
        offset.set(withSpring(0));
      }
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.get() }],
  }));

  const idleStyle = useAnimatedStyle(() => ({
    opacity: maxX > 0 ? 1 - offset.get() / maxX : 1,
  }));

  return (
    <GestureDetector gesture={pan}>
      <View
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Проведіть вправо або двічі торкніться, щоб підтвердити"
        accessibilityState={{ disabled: disabled || done }}
        accessibilityActions={[{ name: 'activate' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName !== 'activate') return;
          if (disabled || confirmed.get()) return;
          confirmed.set(true);
          offset.set(withTiming(maxX, { duration: 300, easing: Easing.out(Easing.cubic) }));
          handleConfirmed();
        }}
        onLayout={(event) => setMaxX(event.nativeEvent.layout.width - KNOB - INSET * 2)}
        style={[
          styles.track,
          { borderRadius: theme.radius.pill },
          disabled && { backgroundColor: theme.colors.bg.subtle },
          style,
        ]}
      >
        {!disabled && (
          <LinearGradient
            colors={theme.gradients[gradient]}
            start={theme.gradientDirection.start}
            end={theme.gradientDirection.end}
            style={StyleSheet.absoluteFill}
          />
        )}

        {done ? (
          <Text variant="button" color={textColor} style={styles.doneLabel}>
            {label}
          </Text>
        ) : (
          <Animated.View style={[StyleSheet.absoluteFill, styles.idleRow, idleStyle]}>
            <Text variant="labelMonoBold" color={textColor} style={styles.hint}>
              ›››
            </Text>
            <Text variant="button" color={textColor} style={styles.idleLabel}>
              {label}
            </Text>
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.knob,
            theme.shadows.slideKnob,
            { backgroundColor: theme.colors.bg.surface },
            knobStyle,
          ]}
        >
          {done ? (
            <Icon name="check" color={iconColor} />
          ) : (
            <Icon name="chevron-right" color={iconColor} />
          )}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: HEIGHT,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  idleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: INSET + KNOB + 18,
    paddingRight: 28,
  },
  hint: {
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0.64, // 4%
  },
  idleLabel: {
    flex: 1,
    textAlign: 'right',
  },
  doneLabel: {
    textAlign: 'center',
    marginHorizontal: INSET + KNOB + INSET,
    opacity: 0.9,
  },
  knob: {
    position: 'absolute',
    left: INSET,
    top: INSET,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});