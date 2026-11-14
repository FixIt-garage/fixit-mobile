import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme';
import { Icon } from './Icon';
import type { IconName } from './Icon/Icon';

const SIZE = 44;

export type GlassIconButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  testID?: string;
};

export function GlassIconButton({ icon, accessibilityLabel, onPress, testID }: GlassIconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.glass.button,
          borderColor: theme.colors.glass.buttonBorder,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Icon name={icon} size={20} color="text/onInverse" strokeWidth={1.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});