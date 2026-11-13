import { View } from 'react-native';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Card } from './Card';
import { Text } from './Text';

function CardContent() {
  return (
    <View style={{ gap: 4 }}>
      <Text variant="h2">Заголовок картки</Text>
      <Text variant="body" color="secondary">
        Базова картка: фон surface, тонка рамка, радіус 24, відступ 16.
      </Text>
    </View>
  );
}

const meta = {
  title: 'Cards/Card',
  component: Card,
  args: {
    children: <CardContent />,
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Static: Story = {};

export const Pressable: Story = {
  args: {
    onPress: action('press'),
    accessibilityLabel: 'Відкрити картку',
  },
};

export const LongText: Story = {
  args: {
    children: (
      <Text variant="body">
        Дуже довгий текст усередині картки, щоб перевірити перенесення рядків і те, що
        відступи та рамка не ламаються, коли контенту значно більше, ніж зазвичай.
      </Text>
    ),
  },
};