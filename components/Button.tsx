import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/theme';
import { Text } from './Text';

export type ButtonProps = Omit<PressableProps, 'style' | 'children' | 'disabled'> & {
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  /** Необовʼязкова іконка зліва від тексту */
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();

  const textColor = disabled ? 'disabled' : variant === 'primary' ? 'onBrand' : 'brand';
  const showGradient = variant === 'primary' && !disabled;
  const backgroundColor = disabled
    ? theme.colors.bg.subtle
    : variant === 'secondary'
      ? theme.colors.bg.brandSoft
      : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          height: theme.layout.buttonHeight,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.radius.pill,
          backgroundColor,
        },
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {showGradient && (
        <LinearGradient
          colors={theme.gradients.client}
          start={theme.gradientDirection.start}
          end={theme.gradientDirection.end}
          style={StyleSheet.absoluteFill}
        />
      )}

      {loading ? (
        <ActivityIndicator testID="button-loading" color={theme.colors.text[textColor]} />
      ) : (
        <View style={[styles.content, { gap: theme.spacing.sm }]}>
          {icon}
          <Text variant="button" color={textColor}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});