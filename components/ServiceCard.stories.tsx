import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ServiceCard } from './ServiceCard';

const meta = {
  title: 'Cards/ServiceCard',
  component: ServiceCard,
  args: {
    name: 'ТехноСервіс',
    address: 'вул. Городоцька, 15',
    rating: 4.6,
    hours: 'Відчинено до 19:00',
    onPress: action('press'),
  },
} satisfies Meta<typeof ServiceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutHours: Story = {
  args: { hours: undefined },
};

export const LongText: Story = {
  args: {
    name: 'Сервісний центр побутової та цифрової техніки «ТехноСервіс Плюс»',
    address: 'вул. Героїв Української Повстанської Армії, 123, корпус 4',
  },
};