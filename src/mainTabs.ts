import type { TabBarTab } from '../components/TabBar';

export const MAIN_TABS = [
  { key: 'home', label: 'Головна', icon: 'house' },
  { key: 'requests', label: 'Заявки', icon: 'clipboard-list' },
  { key: 'chats', label: 'Чати', icon: 'message-square-text' },
  { key: 'profile', label: 'Профіль', icon: 'user' },
] as const satisfies readonly TabBarTab[];

export type MainTabKey = (typeof MAIN_TABS)[number]['key'];