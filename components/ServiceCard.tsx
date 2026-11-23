import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { formatRating } from '../src/format';
import { Card } from './Card';
import { Icon } from './Icon';
import { NutRating } from './NutRating';
import { Text } from './Text';

export type ServiceCardProps = {
  name: string;
  address?: string;
  rating: number | null;
  hours?: string;
  open?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ServiceCard({
  name,
  address,
  rating,
  hours,
  open = true,
  onPress,
  style,
}: ServiceCardProps) {
  const theme = useTheme();

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={[
        name,
        address,
        hours,
        rating !== null ? `рейтинг ${formatRating(rating)}` : null,
      ]
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
        {address ? (
          <Text variant="bodySmall" color="secondary" numberOfLines={1}>
            {address}
          </Text>
        ) : null}
        {hours ? (
          <View
            testID="service-card-hours"
            style={[
              styles.hours,
              {
                backgroundColor: open ? theme.colors.bg.successSoft : theme.colors.bg.subtle,
                borderRadius: theme.radius.pill,
              },
            ]}
          >
            <Text
              variant="labelMonoBold"
              color={open ? 'success' : 'secondary'}
              numberOfLines={1}
            >
              {hours}
            </Text>
          </View>
        ) : null}
      </View>

      {rating !== null ? <NutRating mode="display" rating={rating} size={44} /> : null}
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