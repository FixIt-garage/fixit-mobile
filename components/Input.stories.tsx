import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Input } from './Input';

const meta = {
  title: 'Controls/Input',
  component: Input,
  args: {
    label: 'Що зламалося?',
    placeholder: 'Опишіть поломку',
    helper: 'Наприклад: пральна машина',
  },
  render: function Render(args) {
    const [text, setText] = useState('');
    return <Input {...args} value={text} onChangeText={setText} />;
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithError: Story = { args: { error: 'Опишіть поломку' } };
export const Password: Story = {
  args: { label: 'Пароль', placeholder: 'Мінімум 8 символів', helper: undefined, password: true },
};