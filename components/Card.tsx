import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';

const CARD_RADIUS = 24;

export type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, onPress, accessibilityLabel, testID, style }: CardProps) {
  const theme = useTheme();

  const baseStyle = [
    styles.card,
    {
      padding: theme.spacing.lg,
      borderColor: theme.colors.border.default,
      backgroundColor: theme.colors.bg.surface,
    },
    style,
  ];

  if (!onPress) {
    return (
      <View testID={testID} style={baseStyle}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        baseStyle,
        pressed && { backgroundColor: theme.colors.bg.subtle, transform: [{ scale: 0.98 }] },
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
  },
});