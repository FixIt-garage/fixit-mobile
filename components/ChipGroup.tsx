import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../src/theme';
import { CategoryChip } from './CategoryChip';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
};

type ChipGroupCommonProps<T extends string> = {
  options: readonly ChipOption<T>[];
  layout?: 'scroll' | 'wrap';
  accent?: 'brand' | 'master';
};

type ChipGroupSingleProps<T extends string> = ChipGroupCommonProps<T> & {
  mode: 'single';
  value: T | null;
  onChange: (value: T) => void;
};

type ChipGroupMultipleProps<T extends string> = ChipGroupCommonProps<T> & {
  mode: 'multiple';
  value: readonly T[];
  onChange: (value: T[]) => void;
};

export type ChipGroupProps<T extends string> =
  | ChipGroupSingleProps<T>
  | ChipGroupMultipleProps<T>;

export function ChipGroup<T extends string>(props: ChipGroupProps<T>) {
  const theme = useTheme();
  const { layout = 'scroll', accent = 'brand' } = props;

  const chips: ReactNode[] = props.options.map((option) => {
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
        accent={accent}
        onPress={handlePress}
      />
    );
  });

  if (layout === 'wrap') {
    return <View style={[styles.wrap, { gap: theme.spacing.sm }]}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, { gap: theme.spacing.sm }]}
    >
      {chips}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});