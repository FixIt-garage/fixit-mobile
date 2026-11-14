import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ProfileCompletionCard } from './ProfileCompletionCard';

const meta = {
  title: 'Profile/ProfileCompletionCard',
  component: ProfileCompletionCard,
  args: {
    progress: 0.4,
    hint: 'Додайте фото — майстрам буде простіше вас впізнати.',
    onAction: action('fill'),
  },
} satisfies Meta<typeof ProfileCompletionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Client: Story = {};

export const AlmostDone: Story = {
  args: { progress: 0.9 },
};