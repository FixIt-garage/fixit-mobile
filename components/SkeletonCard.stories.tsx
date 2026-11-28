import type { Meta, StoryObj } from '@storybook/react-native';
import { SkeletonCard } from './SkeletonCard';

const meta = {
  title: 'Cards/SkeletonCard',
  component: SkeletonCard,
  args: {
    opacity: 1,
  },
} satisfies Meta<typeof SkeletonCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Faded: Story = {
  args: { opacity: 0.46 },
};