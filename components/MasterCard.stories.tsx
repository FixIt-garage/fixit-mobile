import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MasterCard } from './MasterCard';

const meta = {
  title: 'Cards/MasterCard',
  component: MasterCard,
  args: {
    name: 'Андрій Мельник',
    specialization: 'Побутова техніка · Сихів',
    rating: 4.8,
    reviewsCount: 32,
    volunteer: true,
    onPress: action('press'),
  },
} satisfies Meta<typeof MasterCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Volunteer: Story = {};

export const NotVolunteer: Story = {
  args: { volunteer: false, reviewsCount: 1, rating: 5 },
};

export const LongText: Story = {
  args: {
    name: 'Олександр-Святослав Костянтинопольський',
    specialization: 'Ремонт побутової техніки, кондиціонерів і бойлерів · Франківський район',
    reviewsCount: 125,
  },
};