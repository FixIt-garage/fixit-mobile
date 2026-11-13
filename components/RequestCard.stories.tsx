import { View } from 'react-native';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { RequestCard } from './RequestCard';

const meta = {
  title: 'Cards/RequestCard',
  component: RequestCard,
  args: {
    category: 'Побутова техніка',
    title: 'Пральна машина не зливає воду',
    status: 'accepted',
    date: new Date(2026, 9, 21),
    author: 'Андрій Мельник',
    onPress: action('press'),
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['sent', 'accepted', 'inProgress', 'done', 'declined'],
    },
  },
} satisfies Meta<typeof RequestCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAuthor: Story = {
  args: { status: 'sent', author: undefined },
};

export const LongText: Story = {
  args: {
    category: 'Ремонт великої побутової техніки та кондиціонерів',
    title: 'Пральна машина не зливає воду і гучно гуде на віджимі, а дверцята не відчиняються',
  },
};

export const AllStatuses: Story = {
  render: (args) => (
    <View style={{ gap: 12 }}>
      <RequestCard {...args} status="sent" />
      <RequestCard {...args} status="accepted" />
      <RequestCard {...args} status="inProgress" />
      <RequestCard {...args} status="done" />
      <RequestCard {...args} status="declined" />
    </View>
  ),
};