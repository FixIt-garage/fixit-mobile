import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { VolunteerRequestCard } from './VolunteerRequestCard';

const meta = {
  title: 'Cards/VolunteerRequestCard',
  component: VolunteerRequestCard,
  args: {
    organization: 'БФ «Тепла хата»',
    title: 'Полагодити обігрівачі в притулку',
    date: new Date(2026, 9, 26, 10, 0),
    place: 'Сихів',
    joined: 3,
    needed: 5,
    onPress: action('press'),
  },
} satisfies Meta<typeof VolunteerRequestCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { joined: 0 },
};

export const Full: Story = {
  args: { joined: 5 },
};

export const LongText: Story = {
  args: {
    organization: 'Благодійний фонд допомоги ветеранам і переселенцям «Тепла хата»',
    title: 'Полагодити обігрівачі та перевірити електропроводку в усіх кімнатах притулку',
    place: 'Сихівський район, вул. Хоткевича',
  },
};