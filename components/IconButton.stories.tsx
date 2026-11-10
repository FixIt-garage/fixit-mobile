import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Icon } from './Icon/Icon';
import { IconButton } from './IconButton';

const meta = {
  title: 'Controls/IconButton',
  component: IconButton,
  args: {
    accessibilityLabel: 'Назад',
    icon: (color) => <Icon name="chevron-left" color={color} />,
    onPress: action('pressed'),
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['white', 'glass'] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const White: Story = { args: { variant: 'white' } };
export const Glass: Story = {
  args: { variant: 'glass' },
  parameters: { backgrounds: { default: 'graphite' } },
};