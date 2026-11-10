import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme';

const WIDTH = 52;
const HEIGHT = 32;
const KNOB = 24;
const PADDING = 4;
// На скільки кружечок зсувається вправо у стані on
const TRAVEL = WIDTH - KNOB - PADDING * 2;

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function Toggle({ value, onValueChange, disabled = false, accessibilityLabel }: ToggleProps) {
  const theme = useTheme();
  const [offset] = useState(() => new Animated.Value(value ? TRAVEL : 0));

  // Плавно пересуваємо кружечок, коли змінюється value
  useEffect(() => {
    Animated.timing(offset, {
      toValue: value ? TRAVEL : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [value, offset]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={6}
      style={[
        styles.track,
        {
          borderRadius: theme.radius.pill,
          backgroundColor: value ? theme.colors.bg.brand : theme.colors.border.default,
        },
        disabled && styles.disabled,
      ]}
    >
      <Animated.View
        style={[
          styles.knob,
          theme.shadows.knob,
          { backgroundColor: theme.colors.bg.surface, transform: [{ translateX: offset }] },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    paddingHorizontal: PADDING,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
  },
  disabled: {
    opacity: 0.4,
  },
});