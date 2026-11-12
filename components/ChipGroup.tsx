import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme';
import { CategoryChip } from './CategoryChip';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
};

type ChipGroupSingleProps<T extends string> = {
  mode: 'single';
  options: readonly ChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

type ChipGroupMultipleProps<T extends string> = {
  mode: 'multiple';
  options: readonly ChipOption<T>[];
  value: readonly T[];
  onChange: (value: T[]) => void;
};

export type ChipGroupProps<T extends string> =
  | ChipGroupSingleProps<T>
  | ChipGroupMultipleProps<T>;

export function ChipGroup<T extends string>(props: ChipGroupProps<T>) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.content,
        { gap: theme.spacing.sm },
      ]}
    >
      {props.options.map((option) => {
        const selected =
          props.mode === 'single'
            ? props.value === option.value
            : props.value.includes(option.value);

        const handlePress = () => {
          if (props.mode === 'single') {
            if (props.value !== option.value) {
              props.onChange(option.value);
            }
            return;
          }

          const nextValue = selected
            ? props.value.filter((value) => value !== option.value)
            : [...props.value, option.value];

          props.onChange(nextValue);
        };

        return (
          <CategoryChip
            key={option.value}
            label={option.label}
            selected={selected}
            onPress={handlePress}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});