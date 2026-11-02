import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';

const SIZE = 44;

export type IconButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  /** Обовʼязково: у кнопки немає тексту, тож VoiceOver читає саме це */
  accessibilityLabel: string;
  /** glass — на градієнті, white — на світлому фоні */
  variant?: 'glass' | 'white';
  /** Отримує правильний колір іконки для цього варіанту */
  icon: (color: string) => ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ variant = 'white', icon, style, ...rest }: IconButtonProps) {
  const theme = useTheme();
  const iconColor = variant === 'glass' ? theme.colors.text.onBrand : theme.colors.icon.default;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        { borderRadius: theme.radius.pill },
        variant === 'glass'
          ? {
              backgroundColor: theme.colors.glass.bg,
              borderWidth: 1,
              borderColor: theme.colors.glass.border,
            }
          : [{ backgroundColor: theme.colors.bg.surface }, theme.shadows.card],
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {icon(iconColor)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});