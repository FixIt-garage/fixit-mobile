import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';

export type CategoryChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function CategoryChip({ label, selected, onPress }: CategoryChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: selected ? theme.colors.bg.brand : theme.colors.bg.surface,
          borderColor: selected ? theme.colors.bg.brand : theme.colors.border.default,
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