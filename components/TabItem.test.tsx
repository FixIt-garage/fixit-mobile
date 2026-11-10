import { fireEvent, render, screen } from '@testing-library/react-native';
import { TabItem } from './TabItem';

describe('TabItem', () => {
  it('shows the label only when active', async () => {
    await render(<TabItem icon="house" label="Головна" active onPress={jest.fn()} />);
    expect(screen.getByText('Головна')).toBeTruthy();
  });

  it('hides the label but keeps it for screen readers when inactive', async () => {
    await render(<TabItem icon="house" label="Головна" active={false} onPress={jest.fn()} />);

    expect(screen.queryByText('Головна')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Головна', selected: false })).toBeTruthy();
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<TabItem icon="house" label="Головна" active={false} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('tab', { name: 'Головна' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});