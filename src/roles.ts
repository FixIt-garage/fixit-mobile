import type { GradientName } from './theme';

export type Role = 'client' | 'master' | 'center' | 'org';

export type RoleInfo = {
  role: Role & GradientName;
  kicker: string;
  title: string;
  description: string;
  buttonLabel: string;
};

export const ROLES: readonly RoleInfo[] = [
  {
    role: 'client',
    kicker: 'Потрібен ремонт',
    title: 'Клієнт',
    description: 'Шукаю майстра або сервіс, щоб щось полагодити',
    buttonLabel: 'Я — клієнт',
  },
  {
    role: 'master',
    kicker: 'Ремонтую',
    title: 'Майстер',
    description: 'Ремонтую техніку й речі та хочу отримувати заявки',
    buttonLabel: 'Я — майстер',
  },
  {
    role: 'center',
    kicker: 'Маю сервіс',
    title: 'Сервісний центр',
    description: 'Маю сервіс з адресою й графіком роботи',
    buttonLabel: 'Це мій сервіс',
  },
  {
    role: 'org',
    kicker: 'Допомагаю людям',
    title: 'Волонтерська організація',
    description: 'Шукаю майстрів, щоб допомагати людям',
    buttonLabel: 'Ми — організація',
  },
];