import { ScrollView, StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from '../../components/Text';
import { theme } from './theme';

// Перетворює вкладені кольори на список «bg.screen → #F6F7F9»
function flatten(obj: object, prefix = ''): [string, string][] {
  return Object.entries(obj).flatMap(([key, value]): [string, string][] =>
    typeof value === 'string' ? [[`${prefix}${key}`, value]] : flatten(value, `${prefix}${key}.`),
  );
}

const meta = { title: 'Foundations/Colors' } satisfies Meta;

export default meta;

export const All: StoryObj<typeof meta> = {
  render: () => (
    <ScrollView contentContainerStyle={styles.list}>
      {flatten(theme.colors).map(([name, value]) => (
        <View key={name} style={styles.row}>
          <View
            style={[styles.swatch, { backgroundColor: value, borderColor: theme.colors.border.default }]}
          />
          <View>
            <Text variant="bodyBold">{name}</Text>
            <Text variant="labelMono" color="secondary">
              {value}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  list: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  swatch: { width: 48, height: 48, borderRadius: 12, borderWidth: 1 },
});