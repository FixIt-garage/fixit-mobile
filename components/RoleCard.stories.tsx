import type { Meta, StoryObj } from '@storybook/react-native';
import { ROLES } from '../src/roles';
import { RoleCard } from './RoleCard';

const [client, master, center, org] = ROLES;

const meta = {
  title: 'Cards/RoleCard',
  component: RoleCard,
  args: {
    kicker: client.kicker,
    title: client.title,
    description: client.description,
    buttonLabel: client.buttonLabel,
    gradient: client.role,
    onPress: () => {},
  },
  argTypes: {
    gradient: { control: { type: 'select' }, options: ['client', 'master', 'center', 'org'] },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof RoleCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Client: Story = {};
export const Master: Story = { args: { ...master, gradient: master.role } };
export const Center: Story = { args: { ...center, gradient: center.role } };
export const Org: Story = { args: { ...org, gradient: org.role } };