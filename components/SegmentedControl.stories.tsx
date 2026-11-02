import { useState } from 'react';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { SegmentedControl, type SegmentedControlProps } from './SegmentedControl';

const options = [
  { value: 'masters', label: 'Майстри' },
  { value: 'services', label: 'Сервіси' },
] as const;

// Тримає стан, щоб сегменти можна було перемикати на телефоні
function SegmentedControlWithState(props: SegmentedControlProps<string>) {
  const [value, setValue] = useState(props.value);
  return (
    <SegmentedControl
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const meta = {
  title: 'Controls/SegmentedControl',
  component: SegmentedControl,
  args: { options, value: 'masters', onChange: action('changed') },
  // key: коли value змінюють у Controls, компонент перестворюється з новим значенням
  render: (args) => <SegmentedControlWithState key={args.value} {...args} />,
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Masters: Story = {};
export const Services: Story = { args: { value: 'services' } };