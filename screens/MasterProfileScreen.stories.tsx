import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MOCK_MASTER_PUBLIC, MOCK_REVIEWS } from '../src/api/masterPublic';
import { MasterProfileView } from './MasterProfileScreen';

const meta = {
  title: 'Screens/06 Профіль майстра',
  component: MasterProfileView,
  args: {
    master: MOCK_MASTER_PUBLIC,
    reviews: MOCK_REVIEWS.items,
    reviewsTotal: MOCK_REVIEWS.total,
    reviewsState: 'ready',
    onBack: action('back'),
    onSendRequest: action('send request'),
    onAllReviews: action('all reviews'),
    onRetryReviews: action('retry reviews'),
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof MasterProfileView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoReviews: Story = {
  args: { reviews: [], reviewsTotal: 0 },
};

export const EmptyProfile: Story = {
  args: {
    master: {
      ...MOCK_MASTER_PUBLIC,
      isVolunteer: false,
      rating: null,
      reviewsCount: 0,
      experienceYears: null,
      callOutPrice: null,
      schedule: null,
      district: null,
      specializations: [],
    },
    reviews: [],
    reviewsTotal: 0,
  },
};
export const ReviewsLoading: Story = {
  args: { reviews: [], reviewsState: 'loading' },
};

export const ReviewsError: Story = {
  args: { reviews: [], reviewsState: 'error' },
};