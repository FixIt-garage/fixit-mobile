import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'Display/ErrorState',
  component: ErrorState,
  args: {
    title: "Немає з'єднання",
    text: 'Перевірте інтернет і спробуйте ще раз. Ваша заявка не загубиться.',
    actionLabel: 'Спробувати ще раз',
    onAction: action('retry'),
  },
} satisfies Meta<typeof ErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Offline: Story = {};
export const Retrying: Story = { args: { actionLoading: true } };
export const WithoutAction: Story = {
  args: {
    title: 'Щось пішло не так',
    text: 'Не вдалося завантажити дані.',
    actionLabel: undefined,
    onAction: undefined,
  },
};
