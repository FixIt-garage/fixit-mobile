import { ScrollView, StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from '../../components/Text';
import { theme, type TypographyVariant } from '.';

const meta = { title: 'Foundations/Typography' } satisfies Meta;

export default meta;

export const All: StoryObj<typeof meta> = {
  render: () => (
    <ScrollView contentContainerStyle={styles.list}>
      {(Object.keys(theme.typography) as TypographyVariant[]).map((variant) => (
        <View key={variant} style={styles.item}>
          <Text variant="labelMono" color="secondary">
            {variant} · {theme.typography[variant].fontSize}/{theme.typography[variant].lineHeight}
          </Text>
          <Text variant={variant}>Зламалося? Полагодимо.</Text>
        </View>
      ))}
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  list: { gap: 16 },
  item: { gap: 4 },
});