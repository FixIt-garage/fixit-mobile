import type { Meta, StoryObj } from '@storybook/react-native';
import { StatusChip } from './StatusChip';

const meta = {
  title: 'Display/StatusChip',
  component: StatusChip,
  args: {
    status: 'sent',
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['sent', 'accepted', 'inProgress', 'done', 'declined'],
    },
  },
} satisfies Meta<typeof StatusChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sent: Story = {};

export const Accepted: Story = {
  args: { status: 'accepted' },
};

export const InProgress: Story = {
  args: { status: 'inProgress' },
};

export const Done: Story = {
  args: { status: 'done' },
};

export const Declined: Story = {
  args: { status: 'declined' },
};
