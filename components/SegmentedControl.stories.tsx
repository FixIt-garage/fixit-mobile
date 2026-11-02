import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'masters', label: 'Майстри' },
  { value: 'services', label: 'Сервіси' },
] as const;

const meta = {
  title: 'Controls/SegmentedControl',
  component: SegmentedControl,
  args: { options, value: 'masters', onChange: () => {} },
  argTypes: { onChange: { action: 'changed' } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <SegmentedControl
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Masters: Story = {};
export const Services: Story = { args: { value: 'services' } };