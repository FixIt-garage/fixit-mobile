import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from './Button';

const meta = {
  title: 'Controls/Button',
  component: Button,
  args: {
    label: 'Надіслати заявку',
    variant: 'primary',
  },
    argTypes: {
    variant: { control: { type: 'select' }, options: ['primary', 'secondary'] },
    gradient: { control: { type: 'select' }, options: ['client', 'master', 'center', 'org'] },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };