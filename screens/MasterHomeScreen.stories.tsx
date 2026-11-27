import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MOCK_CATEGORIES } from '../src/api/categories';
import { MOCK_MASTER_REQUESTS } from '../src/api/masterRequests';
import { MOCK_VOLUNTEER_REQUESTS } from '../src/api/volunteer';
import { MasterHomeView, RESPOND_ERROR } from './MasterHomeScreen';

const meta = {
  title: 'Screens/15 Головна майстра',
  component: MasterHomeView,
  args: {
    firstName: 'Андрій',
    now: new Date(2026, 10, 27, 9, 0),
    requests: MOCK_MASTER_REQUESTS,
    requestsState: 'ready',
    categories: MOCK_CATEGORIES,
    onRetryRequests: action('retry requests'),
    onAccept: action('accept'),
    onDecline: action('decline'),
    showVolunteer: true,
    volunteerRequests: MOCK_VOLUNTEER_REQUESTS,
    volunteerState: 'ready',
    onRetryVolunteer: action('retry volunteer'),
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof MasterHomeView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotVolunteer: Story = {
  args: { showVolunteer: false },
};

export const NoRequests: Story = {
  args: { requests: [] },
};

export const Loading: Story = {
  args: { requests: [], requestsState: 'loading', volunteerState: 'loading' },
};

export const LoadError: Story = {
  args: { requests: [], requestsState: 'error' },
};

export const DecisionError: Story = {
  args: { actionError: RESPOND_ERROR },
};

export const Evening: Story = {
  args: { now: new Date(2026, 10, 27, 19, 30) },
};