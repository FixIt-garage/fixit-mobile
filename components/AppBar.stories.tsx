import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { AppBar } from './AppBar';

const meta = {
  title: 'Navigation/AppBar',
  component: AppBar,
  args: { title: 'FixIt', onSearchPress: action('search') },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutSearch: Story = { args: { showSearch: false } };