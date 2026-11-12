import type { Meta, StoryObj } from '@storybook/react-native';
import { Stat } from './Stat';

const meta = {
  title: 'Display/Stat',
  component: Stat,
  args: {
    value: '4,8',
    label: 'Рейтинг',
  },
} satisfies Meta<typeof Stat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
