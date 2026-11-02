import { fireEvent, render, screen } from '@testing-library/react-native';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('turns on when pressed while off', async () => {
    const onValueChange = jest.fn();
    await render(<Toggle value={false} onValueChange={onValueChange} />);

    await fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('turns off when pressed while on', async () => {
    const onValueChange = jest.fn();
    await render(<Toggle value onValueChange={onValueChange} />);

    await fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('exposes the checked state to screen readers', async () => {
    await render(<Toggle value onValueChange={jest.fn()} accessibilityLabel="Сповіщення" />);
    expect(screen.getByRole('switch', { name: 'Сповіщення', checked: true })).toBeTruthy();
  });

  it('does not change when disabled', async () => {
    const onValueChange = jest.fn();
    await render(<Toggle value={false} disabled onValueChange={onValueChange} />);

    await fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});