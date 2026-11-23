import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MOCK_MASTER_RESULTS, MOCK_SERVICE_CENTER_RESULTS } from '../src/api/search';
import { SearchResultsView } from './SearchResultsScreen';

const meta = {
  title: 'Screens/09 Результати Пошуку',
  component: SearchResultsView,
  args: {
    title: 'Не крутить барабан пральної машини',
    subtitle: 'Львів · Побутова техніка',
    tab: 'masters',
    onTabChange: action('tab change'),
    masters: MOCK_MASTER_RESULTS.items,
    services: MOCK_SERVICE_CENTER_RESULTS.items,
    total: MOCK_MASTER_RESULTS.total,
    state: 'ready',
    onRetry: action('retry'),
    onOpenMaster: action('open master'),
    onBack: action('back'),
  },
} satisfies Meta<typeof SearchResultsView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Masters: Story = {};

export const Services: Story = {
  args: { tab: 'services', total: MOCK_SERVICE_CENTER_RESULTS.total },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const Empty: Story = {
  args: { masters: [], total: 0 },
};

export const Error: Story = {
  args: { state: 'error' },
};

export const LoadingMore: Story = {
  args: { loadingMore: true },
};
export const LoadMoreError: Story = {
  args: { loadMoreError: true, onRetryLoadMore: action('retry load more') },
};