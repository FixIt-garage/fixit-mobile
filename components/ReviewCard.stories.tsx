import type { Meta, StoryObj } from '@storybook/react-native';
import { ReviewCard } from './ReviewCard';

const meta = {
  title: 'Cards/ReviewCard',
  component: ReviewCard,
  args: {
    name: 'Ірина',
    rating: 5,
    text: 'Швидко полагодив пральну машину, все пояснив.',
  },
} satisfies Meta<typeof ReviewCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LowRating: Story = {
  args: { name: 'Олег', rating: 2.5, text: 'Запізнився на годину.' },
};

export const LongText: Story = {
  args: {
    name: 'Олександра-Вікторія Костянтинопольська',
    text: 'Майстер приїхав вчасно, уважно вислухав, знайшов причину поломки за пів години, замінив насос і показав, як чистити фільтр, щоб таке не повторювалось. Ціна відповідала домовленості, після себе все прибрав. Однозначно звертатимусь ще.',
  },
};