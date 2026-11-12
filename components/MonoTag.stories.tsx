import type { Meta, StoryObj } from '@storybook/react-native';
import { MonoTag } from './MonoTag';

const meta = {
  title: 'Display/MonoTag',
  component: MonoTag,
  args: {
    label: 'Виконано',
  },
} satisfies Meta<typeof MonoTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Done: Story = {};