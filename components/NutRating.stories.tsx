import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NutRating } from './NutRating';

const meta = {
  title: 'Display/NutRating',
  component: NutRating,
} satisfies Meta<typeof NutRating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: {
    mode: 'display',
    rating: 4.8,
  },
};

function InteractiveInput() {
  const [value, setValue] = useState(0);

  return (
    <NutRating
      mode="input"
      value={value}
      onChange={setValue}
    />
  );
}

export const Input: Story = {
  args: {
    mode: 'input',
    value: 0,
    onChange: () => {},
  },
  render: () => <InteractiveInput />,
};
