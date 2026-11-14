import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ProfileHero } from './ProfileHero';

const meta = {
  title: 'Profile/ProfileHero',
  component: ProfileHero,
  args: {
    role: 'client',
    name: 'Олександр Коваль',
    meta: 'Клієнт · Львів · ID 3120',
    stats: [
      { label: 'Заявки', value: '3' },
      { label: 'Відгуки', value: '2' },
      { label: 'З нами з', value: '2026' },
    ],
    onEdit: action('edit'),
    onLogout: action('logout'),
  },
} satisfies Meta<typeof ProfileHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Client: Story = {};

export const LongName: Story = {
  args: { name: 'Олександра-Вікторія Костянтинопольська' },
};