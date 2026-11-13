
import type { Meta, StoryObj } from '@storybook/react-native';
import { VolunteerBadge } from './VolunteerBadge';

const meta = {
  title: 'Display/VolunteerBadge',
  component: VolunteerBadge,
} satisfies Meta<typeof VolunteerBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
