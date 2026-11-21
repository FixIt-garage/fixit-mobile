import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MOCK_SERVICE_CENTER } from '../src/api/serviceCenters';
import { ServiceCenterProfileView } from './ServiceCenterProfileScreen';

const meta = {
  title: 'Screens/07 Сторінка сервісного центру',
  component: ServiceCenterProfileView,
  args: {
    center: {
      ...MOCK_SERVICE_CENTER,
      address: 'вул. Городоцька, 15',
      city: 'Львів',
      phone: '+380 32 245 67 89',
    },
    onBack: action('back'),
    onRequest: action('request'),
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof ServiceCenterProfileView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  args: {
    center: {
      ...MOCK_SERVICE_CENTER,
      address: 'вул. Городоцька, 15',
      city: 'Львів',
      phone: '+380 32 245 67 89',
      isOpen: false,
      workingStatus: 'ЗАЧИНЕНО',
    },
  },
};
