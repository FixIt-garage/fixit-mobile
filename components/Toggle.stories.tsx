import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Toggle } from './Toggle';

const meta = {
  title: 'Controls/Toggle',
  component: Toggle,
  args: { value: false, onValueChange: () => {} },
  argTypes: { onValueChange: { action: 'changed' } },
  // Тримаємо стан усередині story, щоб перемикач можна було клацати
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <Toggle
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { value: true } };
export const Disabled: Story = { args: { disabled: true } };