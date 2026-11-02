import { useState } from 'react';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Toggle, type ToggleProps } from './Toggle';

// Тримає стан, щоб перемикач можна було клацати на телефоні
function ToggleWithState(props: ToggleProps) {
  const [value, setValue] = useState(props.value);
  return (
    <Toggle
      {...props}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        props.onValueChange(next);
      }}
    />
  );
}

const meta = {
  title: 'Controls/Toggle',
  component: Toggle,
  args: { value: false, onValueChange: action('changed') },
  // key: коли value змінюють у Controls, компонент перестворюється з новим значенням
  render: (args) => <ToggleWithState key={String(args.value)} {...args} />,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { value: true } };
export const Disabled: Story = { args: { disabled: true } };