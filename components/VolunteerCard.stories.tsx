import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { VolunteerCard } from './VolunteerCard';

function VolunteerCardWithState({ initial }: { initial: boolean }) {
  const [value, setValue] = useState(initial);
  return <VolunteerCard value={value} onChange={setValue} />;
}

const meta = {
  title: 'Profile/VolunteerCard',
  component: VolunteerCardWithState,
  args: { initial: true },
} satisfies Meta<typeof VolunteerCardWithState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const On: Story = {};

export const Off: Story = {
  args: { initial: false },
};