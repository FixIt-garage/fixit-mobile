import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { BottomSheet } from './BottomSheet';
import { Text } from './Text';

const meta = {
  title: 'Layout/BottomSheet',
  component: BottomSheet,
  args: {
    children: <Text>Вміст аркуша</Text>,
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Surface: Story = {};

export const WithHandle: Story = {
  args: { handle: true },
};

export const ScreenBackground: Story = {
  args: { background: 'screen' },
};