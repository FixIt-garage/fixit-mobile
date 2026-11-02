import { fireEvent, render, screen } from '@testing-library/react-native';
import { RoleCard } from './RoleCard';

const props = {
  kicker: 'Потрібен ремонт',
  title: 'Клієнт',
  description: 'Шукаю майстра або сервіс, щоб щось полагодити',
  buttonLabel: 'Я — клієнт',
  gradient: 'client' as const,
};

describe('RoleCard', () => {
  it('shows the role texts', async () => {
    await render(<RoleCard {...props} onPress={jest.fn()} />);

    expect(screen.getByText('Потрібен ремонт')).toBeTruthy();
    expect(screen.getByText('Клієнт')).toBeTruthy();
    expect(screen.getByText('Шукаю майстра або сервіс, щоб щось полагодити')).toBeTruthy();
  });

  it('calls onPress from its button', async () => {
    const onPress = jest.fn();
    await render(<RoleCard {...props} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Я — клієнт' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});