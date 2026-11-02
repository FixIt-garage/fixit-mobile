import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from '../../components/Text';
import { theme, type GradientName } from '.';

const meta = { title: 'Foundations/Gradients' } satisfies Meta;

export default meta;

export const All: StoryObj<typeof meta> = {
  render: () => (
    <View style={styles.list}>
      {(Object.keys(theme.gradients) as GradientName[]).map((name) => (
        <View key={name} style={styles.item}>
          <LinearGradient
            colors={theme.gradients[name]}
            start={theme.gradientDirection.start}
            end={theme.gradientDirection.end}
            style={[styles.bar, { borderRadius: theme.radius.pill }]}
          />
          <Text variant="labelMono" color="secondary">
            Gradient/{name}
          </Text>
        </View>
      ))}
    </View>
  ),
};

const styles = StyleSheet.create({
  list: { gap: 16 },
  item: { gap: 6 },
  bar: { height: 56 },
});
