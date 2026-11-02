import type { Meta, StoryObj } from '@storybook/react-native';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Controls/ProgressBar',
  component: ProgressBar,
  args: { value: 0.4 },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    gradient: { control: { type: 'select' }, options: ['client', 'master', 'center', 'org'] },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Master: Story = { args: { gradient: 'master', value: 0.7 } };
export const Thin: Story = { args: { height: 6, value: 0.5 } };