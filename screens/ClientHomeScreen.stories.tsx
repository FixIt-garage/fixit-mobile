import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MOCK_CATEGORIES } from '../src/api/categories';
import { ClientHomeView } from './ClientHomeScreen';

const meta = {
  title: 'Screens/08 Головна клієнта',
  component: ClientHomeView,
  args: {
    firstName: 'Олександр',
    initialCity: 'Львів',
    categories: MOCK_CATEGORIES.filter((category) => category.parentId === null),
    categoriesState: 'ready',
    onRetryCategories: action('retry categories'),
    onSearch: action('search'),
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof ClientHomeView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CategoriesLoading: Story = {
  args: { categories: [], categoriesState: 'loading' },
};

export const CategoriesError: Story = {
  args: { categories: [], categoriesState: 'error' },
};

export const NoCity: Story = {
  args: { initialCity: null, firstName: 'Анна' },
};