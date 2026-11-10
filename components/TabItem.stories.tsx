import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { iconNames } from './Icon/Icon';
import { TabItem } from './TabItem';

const meta = {
  title: 'Navigation/TabItem',
  component: TabItem,
  args: { icon: 'house', label: 'Головна', active: true, onPress: action('pressed') },
  argTypes: {
    icon: { control: { type: 'select' }, options: iconNames },
  },
  parameters: { backgrounds: { default: 'graphite' } },
} satisfies Meta<typeof TabItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Active: Story = {};
export const Inactive: Story = { args: { active: false } };