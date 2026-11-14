import type { Meta, StoryObj } from '@storybook/react-native';
import { ContactsCard } from './ContactsCard';

const meta = {
  title: 'Profile/ContactsCard',
  component: ContactsCard,
  args: {
    phone: '+380 67 123 45 67',
    email: 'oleksandr.koval@gmail.com',
    address: 'Львів, вул. Наукова, 7',
  },
} satisfies Meta<typeof ContactsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongAddress: Story = {
  args: { address: 'Львівська область, м. Львів, вул. Героїв Української Повстанської Армії, 123, кв. 45' },
};