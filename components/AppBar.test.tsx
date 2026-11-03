import { fireEvent, render, screen } from '@testing-library/react-native';
import { AppBar } from './AppBar';

describe('AppBar', () => {
  it('shows the title as a header', async () => {
    await render(<AppBar title="FixIt" />);
    expect(screen.getByRole('header', { name: 'FixIt' })).toBeTruthy();
  });

  it('calls onSearchPress from the search button', async () => {
    const onSearchPress = jest.fn();
    await render(<AppBar title="FixIt" onSearchPress={onSearchPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Пошук' }));
    expect(onSearchPress).toHaveBeenCalledTimes(1);
  });

  it('hides search on deep screens', async () => {
    await render(<AppBar title="Деталі" showSearch={false} />);
    expect(screen.queryByRole('button', { name: 'Пошук' })).toBeNull();
  });
});