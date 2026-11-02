import { StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from '../../components/Text';
import { theme } from './theme';

const meta = { title: 'Foundations/Spacing and radius' } satisfies Meta;

export default meta;

export const Spacing: StoryObj<typeof meta> = {
  render: () => (
    <View style={styles.list}>
      {Object.entries(theme.spacing).map(([name, value]) => (
        <View key={name} style={styles.row}>
          <Text variant="labelMono" color="secondary" style={styles.label}>
            {name} · {value}
          </Text>
          <View style={[styles.bar, { width: value, backgroundColor: theme.colors.bg.brand }]} />
        </View>
      ))}
    </View>
  ),
};

export const Radius: StoryObj<typeof meta> = {
  render: () => (
    <View style={styles.grid}>
      {Object.entries(theme.radius).map(([name, value]) => (
        <View key={name} style={styles.cell}>
          <View
            style={[
              styles.box,
              { borderRadius: value, backgroundColor: theme.colors.bg.brandSoft, borderColor: theme.colors.bg.brand },
            ]}
          />
          <Text variant="labelMono" color="secondary">
            {name} · {value}
          </Text>
        </View>
      ))}
    </View>
  ),
};

const styles = StyleSheet.create({
  list: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { width: 80 },
  bar: { height: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  cell: { alignItems: 'center', gap: 6 },
  box: { width: 64, height: 64, borderWidth: 1 },
});