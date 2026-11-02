import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { SlideButton } from './SlideButton';

const meta = {
  title: 'Controls/SlideButton',
  component: SlideButton,
  args: { label: 'Увійти', onConfirm: action('confirmed') },
  argTypes: {
    gradient: { control: { type: 'select' }, options: ['client', 'master', 'center', 'org'] },
  },
} satisfies Meta<typeof SlideButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Master: Story = { args: { gradient: 'master' } };
export const Disabled: Story = { args: { disabled: true } };