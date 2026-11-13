
import { useState } from 'react';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ChipGroup } from './ChipGroup';

const options = [
  { value: 'appliances', label: 'Побутова техніка' },
  { value: 'electronics', label: 'Електроніка' },
  { value: 'furniture', label: 'Меблі' },
  { value: 'clothing', label: 'Одяг' },
];

function SingleSelectStory() {
  const [value, setValue] = useState<string | null>('appliances');

  return (
    <ChipGroup
      mode="single"
      options={options}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        action('onChange')(nextValue);
      }}
    />
  );
}

function MultiSelectStory() {
  const [value, setValue] = useState<string[]>(['appliances']);

  return (
    <ChipGroup
      mode="multiple"
      options={options}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        action('onChange')(nextValue);
      }}
    />
  );
}

const meta = {
  title: 'Display/ChipGroup',
  component: ChipGroup,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ChipGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  args: {
    mode: 'single',
    options,
    value: 'appliances',
    onChange: action('onChange'),
  },
  render: () => <SingleSelectStory />,
};

export const MultiSelect: Story = {
  args: {
    mode: 'multiple',
    options,
    value: ['appliances'],
    onChange: action('onChange'),
  },
  render: () => <MultiSelectStory />,
};
