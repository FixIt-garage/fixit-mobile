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
import { useTheme, type GradientName } from '../src/theme';
import { Text } from './Text';

const SPINNER_SCALE = 22 / 20;

export type ButtonProps = Omit<PressableProps, 'style' | 'children' | 'disabled'> & {
  label: string;
  variant?: 'primary' | 'secondary';
  gradient?: GradientName;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  gradient = 'client',
  disabled = false,
  loading = false,
  icon,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  const textColor = disabled ? 'disabled' : isPrimary ? 'onBrand' : 'brand';
  const spinnerColor = isPrimary ? theme.colors.text.onBrand : theme.colors.text.brand;
  const pressedPrimary =
    gradient === 'client' ? theme.colors.bg.brandPressed : theme.gradients[gradient][1];

  const backgroundFor = (pressed: boolean) => {
    if (disabled) return theme.colors.bg.subtle;
    if (!isPrimary) return theme.colors.bg.brandSoft;
    return pressed ? pressedPrimary : undefined;
  };

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
          backgroundColor: backgroundFor(pressed),
        },
        pressed && !isPrimary && !disabled && {
          borderWidth: 1.5,
          borderColor: theme.colors.text.brand,
        },
        style,
      ]}
      {...rest}
    >
      {({ pressed }) => (
        <>
          {isPrimary && !disabled ? (
            <LinearGradient
              testID="button-gradient"
              pointerEvents="none"
              colors={theme.gradients[gradient]}
              start={theme.gradientDirection.start}
              end={theme.gradientDirection.end}
              style={[StyleSheet.absoluteFill, { opacity: pressed ? 0 : 1 }]}
            />
          ) : null}

          <View
            pointerEvents="none"
            style={[styles.content, { gap: theme.spacing.sm }, loading && styles.hidden]}
            accessibilityElementsHidden={loading}
            importantForAccessibility={loading ? 'no-hide-descendants' : 'auto'}
          >
            {icon}
            <Text variant="button" color={textColor}>
              {label}
            </Text>
          </View>

          {loading ? (
            <View style={styles.spinner} pointerEvents="none">
              <ActivityIndicator
                testID="button-loading"
                color={spinnerColor}
                style={{ transform: [{ scale: SPINNER_SCALE }] }}
              />
            </View>
          ) : null}
        </>
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
  hidden: {
    opacity: 0,
  },
  spinner: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});