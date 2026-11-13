import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { formatRating } from '../src/format';
import { Card } from './Card';
import { NutRating } from './NutRating';
import { Text } from './Text';

export type ReviewCardProps = {
  name: string;
  rating: number;
  text: string;
  style?: StyleProp<ViewStyle>;
};

export function ReviewCard({ name, rating, text, style }: ReviewCardProps) {
  const theme = useTheme();

  return (
    <Card
      accessibilityLabel={`Відгук від ${name}, рейтинг ${formatRating(rating)}: ${text}`}
      style={[
        styles.card,
        { padding: theme.spacing.lg, gap: theme.spacing.sm },
        style,
      ]}
    >
      <View style={styles.head}>
        <Text variant="bodyBold" numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <NutRating mode="display" rating={rating} size={32} />
      </View>

      <Text variant="bodySmall" color="secondary">
        {text}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flexShrink: 1,
  },
});