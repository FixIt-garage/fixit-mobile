import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';

export type CategoryChipProps = {
  label: string;
  selected: boolean;
  accent?: 'brand' | 'master';
  onPress: () => void;
};

export function CategoryChip({
  label,
  selected,
  accent = 'brand',
  onPress,
}: CategoryChipProps) {
  const theme = useTheme();
  const selectedColor =
    accent === 'master' ? theme.colors.role.master : theme.colors.bg.brand;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: selected ? selectedColor : theme.colors.bg.surface,
          borderColor: selected ? selectedColor : theme.colors.border.default,
          borderRadius: theme.radius.pill,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text variant="bodySmall" color={selected ? 'onBrand' : 'primary'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    height: 36,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
});
