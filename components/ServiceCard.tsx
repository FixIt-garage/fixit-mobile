import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { formatRating } from '../src/format';
import { Card } from './Card';
import { Icon } from './Icon';
import { NutRating } from './NutRating';
import { Text } from './Text';

export type ServiceCardProps = {
  name: string;
  address: string;
  rating: number;
  hours?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ServiceCard({ name, address, rating, hours, onPress, style }: ServiceCardProps) {
  const theme = useTheme();

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={[name, address, hours, `рейтинг ${formatRating(rating)}`]
        .filter(Boolean)
        .join(', ')}
      style={[styles.row, style]}
    >
        <View style={[styles.iconBox, { backgroundColor: theme.colors.roleSoft.center }]}>
        <Icon name="store" size={26} color="role/center" />
      </View>

      <View style={styles.info}>
        <Text variant="bodyBold" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="bodySmall" color="secondary" numberOfLines={1}>
          {address}
        </Text>
        {hours ? (
          <View
            style={[
              styles.hours,
              { backgroundColor: theme.colors.bg.successSoft, borderRadius: theme.radius.pill },
            ]}
          >
            <Text variant="labelMonoBold" color="success">
              {hours}
            </Text>
          </View>
        ) : null}
      </View>

      <NutRating mode="display" rating={rating} size={44} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  hours: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
});