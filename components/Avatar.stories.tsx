import type { Meta, StoryObj } from '@storybook/react-native';
import { Avatar } from './Avatar';

const meta = {
  title: 'Display/Avatar',
  component: Avatar,
  args: {
    initials: 'OK',
    gradient: 'client',
    size: 72,
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};