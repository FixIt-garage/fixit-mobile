import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../src/theme';
import { fonts } from '../src/theme/fonts';
import { Text } from './Text';

export type NutRatingProps =
  | {
      mode: 'display';
      rating: number;
    }
  | {
      mode: 'input';
      value: number;
      onChange: (value: number) => void;
    };

const SIZE = 64;

const HEXAGON_PATH =
  'M 26.8 4 Q 32 1 37.2 4 L 52.8 13 Q 58 16 58 22 L 58 42 Q 58 48 52.8 51 L 37.2 60 Q 32 63 26.8 60 L 11.2 51 Q 6 48 6 42 L 6 22 Q 6 16 11.2 13 Z';

function Nut({ active }: { active: boolean }) {
  const theme = useTheme();

  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 64 64">
      <Path
        d={HEXAGON_PATH}
        fill={active ? theme.colors.rating : theme.colors.bg.subtle}
      />
      <Circle
        cx="32"
        cy="32"
        r="12"
        fill={active ? theme.colors.bg.subtle : theme.colors.bg.surface}
      />
    </Svg>
  );
}

export function NutRating(props: NutRatingProps) {
  const theme = useTheme();

  if (props.mode === 'display') {
    return (
      <View
        style={styles.display}
        accessibilityRole="image"
        accessibilityLabel={`Рейтинг ${props.rating}`}
      >
        <Svg
          width={SIZE}
          height={SIZE}
          viewBox="0 0 64 64"
          style={StyleSheet.absoluteFill}
        >
          <Path d={HEXAGON_PATH} fill={theme.colors.rating} />
        </Svg>

        <Text
          style={[
            styles.ratingText,
            { color: theme.colors.bg.inverse },
          ]}
        >
          {props.rating.toFixed(1)}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={styles.input}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Оцініть роботу"
      accessibilityHint="Збільшуйте або зменшуйте оцінку від 1 до 5"
      accessibilityValue={{
        min: 1,
        max: 5,
        ...(props.value > 0 ? { now: props.value } : {}),
        text: props.value === 0 ? 'Не оцінено' : `${props.value} з 5`,
      }}
      accessibilityActions={[
        { name: 'increment', label: 'Збільшити оцінку' },
        { name: 'decrement', label: 'Зменшити оцінку' },
      ]}
      onAccessibilityAction={(event) => {
        const action = event.nativeEvent.actionName;

        if (action === 'increment' && props.value < 5) {
          props.onChange(Math.max(1, props.value + 1));
        } else if (action === 'decrement' && props.value > 1) {
          props.onChange(props.value - 1);
        }
      }}
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <Pressable
          key={rating}
          testID={`nut-rating-${rating}`}
          accessible={false}
          onPress={() => props.onChange(rating)}
        >
          <Nut active={rating <= props.value} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  display: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.64,
    textAlign: 'center',
    includeFontPadding: false,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
