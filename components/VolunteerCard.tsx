import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { Card } from './Card';
import { Icon } from './Icon';
import { Text } from './Text';
import { Toggle } from './Toggle';

export type VolunteerCardProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function VolunteerCard({ value, onChange, style }: VolunteerCardProps) {
  const theme = useTheme();

  return (
    <Card style={style}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.bg.successSoft }]}>
          <Icon name="flag" size={20} color="text/success" strokeWidth={1.75} />
        </View>
        <View style={styles.text}>
          <Text variant="bodyBold">Я волонтер</Text>
          <Text variant="caption" color="secondary">
            Клієнти бачать прапорець біля імені
          </Text>
        </View>
        <Toggle value={value} onValueChange={onChange} accessibilityLabel="Я волонтер" />
      </View>
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
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
});