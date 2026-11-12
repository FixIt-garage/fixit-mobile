
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { CategoryChip } from './CategoryChip';

const meta = {
  title: 'Display/CategoryChip',
  component: CategoryChip,
  args: {
    label: 'Побутова техніка',
    selected: true,
    onPress: action('pressed'),
  },
  argTypes: {
    selected: {
      control: { type: 'boolean' },
    },
    label: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof CategoryChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Selected: Story = {};

export const Unselected: Story = {
  args: { selected: false },
};
