import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { IconButton } from './IconButton';

const meta = {
  title: 'Controls/IconButton',
  component: IconButton,
  args: {
    accessibilityLabel: 'Назад',
    // Тимчасова іконка до FIX-16
    icon: (color: string) => <Text style={{ color, fontSize: 24 }}>‹</Text>,
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['white', 'glass'] },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const White: Story = { args: { variant: 'white' } };
// Glass задуманий для темного/градієнтного фону
export const Glass: Story = {
  args: { variant: 'glass' },
  parameters: { backgrounds: { default: 'graphite' } },
};