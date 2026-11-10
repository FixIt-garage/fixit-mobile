import { fireEvent, render, screen } from '@testing-library/react-native';
import { MAIN_TABS } from '../src/mainTabs';
import { TabBar } from './TabBar';

describe('TabBar', () => {
  it('shows all four tabs and marks the active one', async () => {
    await render(<TabBar tabs={MAIN_TABS} activeKey="requests" onTabPress={jest.fn()} />);

    for (const label of ['Головна', 'Заявки', 'Чати', 'Профіль']) {
      expect(screen.getByRole('tab', { name: label })).toBeTruthy();
    }
    expect(screen.getByRole('tab', { name: 'Заявки', selected: true })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Головна', selected: false })).toBeTruthy();
  });

  it('shows only the active label', async () => {
    await render(<TabBar tabs={MAIN_TABS} activeKey="home" onTabPress={jest.fn()} />);

    expect(screen.getByText('Головна')).toBeTruthy();
    expect(screen.queryByText('Чати')).toBeNull();
  });

  it('reports the pressed tab key', async () => {
    const onTabPress = jest.fn();
    await render(<TabBar tabs={MAIN_TABS} activeKey="home" onTabPress={onTabPress} />);

    await fireEvent.press(screen.getByRole('tab', { name: 'Чати' }));
    expect(onTabPress).toHaveBeenCalledWith('chats');
  });
});