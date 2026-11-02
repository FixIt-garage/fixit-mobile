import type { Meta, StoryObj } from '@storybook/react-native';
import { theme } from '../src/theme';
import { Text } from './Text';

const meta = {
  title: 'Display/Text',
  component: Text,
  args: { children: 'Зламалося? Полагодимо.', variant: 'body', color: 'primary' },
  argTypes: {
    variant: { control: { type: 'select' }, options: Object.keys(theme.typography) },
    color: { control: { type: 'select' }, options: Object.keys(theme.colors.text) },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Body: Story = {};
export const Display: Story = { args: { variant: 'display' } };
export const Label: Story = { args: { variant: 'labelMono', color: 'secondary', children: '№1024 · в роботі · Львів' } };