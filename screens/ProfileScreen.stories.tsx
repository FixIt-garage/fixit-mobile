import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MOCK_PROFILE } from '../src/api/profile';
import { MOCK_MASTER_PROFILE } from '../src/api/masterProfile';
import { ProfileView } from './ProfileScreen';

const meta = {
  title: 'Screens/05 Мій профіль',
  component: ProfileView,
  args: {
    profile: MOCK_PROFILE,
    onLogout: action('logout'),
    onEdit: action('edit'),
    onFill: action('fill'),
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof ProfileView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Client: Story = {};

export const FullyFilled: Story = {
  args: { profile: { ...MOCK_PROFILE, avatarUrl: 'https://i.pravatar.cc/200' } },
};

export const EmptyContacts: Story = {
  args: { profile: { ...MOCK_PROFILE, phone: null, address: null, city: null } },
};
export const Master: Story = {
  args: {
    profile: { ...MOCK_PROFILE, role: 'master', publicId: 247 },
    master: MOCK_MASTER_PROFILE,
    onVolunteerChange: action('volunteer'),
  },
};