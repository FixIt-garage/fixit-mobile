import { StyleSheet, View } from 'react-native';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { GlassIconButton } from './GlassIconButton';
import { HeroCard } from './HeroCard';
import { Text } from './Text';

function SampleContent() {
  return (
    <>
      <View style={styles.topRow}>
        <Text variant="labelMono" color="onInverseMuted" style={styles.label}>
          Мій профіль
        </Text>
        <GlassIconButton
          icon="pencil"
          accessibilityLabel="Редагувати профіль"
          onPress={action('edit')}
        />
        <GlassIconButton icon="log-out" accessibilityLabel="Вийти" onPress={action('logout')} />
      </View>
      <Text variant="h1" color="onInverse">
        Олександр Коваль
      </Text>
    </>
  );
}

const meta = {
  title: 'Layout/HeroCard',
  component: HeroCard,
  args: {
    accent: 'client',
    children: <SampleContent />,
  },
  argTypes: {
    accent: { control: { type: 'select' }, options: ['client', 'master'] },
  },
} satisfies Meta<typeof HeroCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Client: Story = {};

export const Master: Story = {
  args: { accent: 'master' },
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    flex: 1,
  },
});