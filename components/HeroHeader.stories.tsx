import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { HeroHeader } from './HeroHeader';

const meta = {
  title: 'Navigation/HeroHeader',
  component: HeroHeader,
  args: {
    kicker: 'Крок 2 / 2 · акаунт клієнта',
    title: 'Створімо акаунт',
    onBack: action('back'),
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof HeroHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignUp: Story = {};

export const WithoutBack: Story = {
  args: { onBack: undefined, kicker: 'Акаунт FIXIT', title: 'З поверненням!' },
};