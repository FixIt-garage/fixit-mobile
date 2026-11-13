import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroHeader } from './HeroHeader';

describe('HeroHeader', () => {
  it('shows kicker and title', async () => {
    await render(<HeroHeader kicker="Крок 2 / 2" title="Створімо акаунт" />);

    expect(screen.getByText('Крок 2 / 2')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Створімо акаунт' })).toBeTruthy();
  });

  it('shows the back button only with onBack', async () => {
    const onBack = jest.fn();
    const { rerender } = await render(<HeroHeader title="Вхід" />);
    expect(screen.queryByLabelText('Назад')).toBeNull();

    await rerender(<HeroHeader title="Вхід" onBack={onBack} />);
    await fireEvent.press(screen.getByLabelText('Назад'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});