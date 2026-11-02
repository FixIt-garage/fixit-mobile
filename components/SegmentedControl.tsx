import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';

export type SegmentProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Segment({ label, selected, onPress }: SegmentProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.segment,
        { borderRadius: theme.radius.sm, paddingVertical: theme.spacing.sm },
        selected && [{ backgroundColor: theme.colors.bg.surface }, theme.shadows.segment],
      ]}
    >
      <Text variant={selected ? 'bodyBold' : 'body'} color={selected ? 'primary' : 'secondary'}>
        {label}
      </Text>
    </Pressable>
  );
}

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentedControlProps<T extends string> = {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.control,
        {
          backgroundColor: theme.colors.bg.subtle,
          borderRadius: theme.radius.md,
          padding: theme.spacing.xs,
          gap: theme.spacing.xs,
        },
        style,
      ]}
    >
      {options.map((option) => (
        <Segment
          key={option.value}
          label={option.label}
          selected={option.value === value}
          onPress={() => {
            // Повторне натискання на вибраний сегмент нічого не змінює
            if (option.value !== value) onChange(option.value);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});