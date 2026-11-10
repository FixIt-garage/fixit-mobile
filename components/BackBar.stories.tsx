import { action } from 'storybook/actions';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { BackBar } from './BackBar';

const meta = {
  title: 'Navigation/BackBar',
  component: BackBar,
  args: { title: 'Назва екрана', onBack: action('back') },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <NavigationContainer>
          <Story />
        </NavigationContainer>
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof BackBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongTitle: Story = {
  args: { title: 'Дуже довга назва екрана, яка не влазить в один рядок' },
};