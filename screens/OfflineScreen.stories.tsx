import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import OfflineScreen from './OfflineScreen';

const meta = {
  title: "Screens/22 Немає з'єднання",
  component: OfflineScreen,
  args: {
    onRetry: action('retry'),
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof OfflineScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Retrying: Story = { args: { retrying: true } };
