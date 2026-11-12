import type { Meta, StoryObj } from '@storybook/react-native';
import { InfoRow } from './InfoRow';

const meta = {
  title: 'Display/InfoRow',
  component: InfoRow,
  args: {
    text: 'вул. Городоцька, 15, Львів',
    icon: 'map-pin',
  },
} satisfies Meta<typeof InfoRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
