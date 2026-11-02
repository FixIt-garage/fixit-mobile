import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { TextArea } from './TextArea';

const meta = {
  title: 'Controls/TextArea',
  component: TextArea,
  args: {
    label: 'Що зламалося?',
    placeholder: 'Опишіть поломку: що сталося, коли, яка модель',
    maxLength: 500,
  },
  render: function Render(args) {
    const [text, setText] = useState('');
    return <TextArea {...args} value={text} onChangeText={setText} />;
  },
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithError: Story = { args: { error: 'Опис занадто короткий' } };