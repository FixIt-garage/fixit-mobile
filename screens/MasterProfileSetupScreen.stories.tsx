import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MOCK_CATEGORIES } from '../src/api/categories';
import { MOCK_MASTER_PROFILE } from '../src/api/masterProfile';
import { MasterProfileSetupView } from './MasterProfileSetupScreen';

const meta = {
  title: 'Screens/19 Заповнення профілю майстра',
  component: MasterProfileSetupView,
  args: {
    master: { ...MOCK_MASTER_PROFILE, categoryIds: [1, 4], district: 'Сихів' },
    categories: MOCK_CATEGORIES,
    categoriesState: 'ready',
    onRetryCategories: action('retry categories'),
    onBack: action('back'),
    onSave: async (patch) => {
      action('save')(patch);
    },
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof MasterProfileSetupView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    master: {
      ...MOCK_MASTER_PROFILE,
      id: null,
      city: null,
      district: null,
      experienceYears: null,
      callOutPrice: null,
      schedule: null,
      categoryIds: [],
      categoriesCount: 0,
      completeness: { filled: 0, total: 5, percent: 0, nextField: 'categories' },
    },
  },
};

export const CategoriesError: Story = {
  args: { categories: [], categoriesState: 'error' },
};