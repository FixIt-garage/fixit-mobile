import { fireEvent, render, screen } from '@testing-library/react-native';
import { MasterCard, getInitials } from './MasterCard';

const master = {
  name: 'Андрій Мельник',
  specialization: 'Побутова техніка · Сихів',
  rating: 4.8,
  reviewsCount: 32,
};

describe('MasterCard', () => {
  it('shows name, specialization, reviews and rating', async () => {
    await render(<MasterCard {...master} />);

    expect(screen.getByText('Андрій Мельник')).toBeTruthy();
    expect(screen.getByText('Побутова техніка · Сихів')).toBeTruthy();
    expect(screen.getByText('· 32 відгуки')).toBeTruthy();
    expect(screen.getByText('4,8')).toBeTruthy();
  });

  it('shows the volunteer badge only for volunteers', async () => {
    const { rerender } = await render(<MasterCard {...master} />);
    expect(screen.queryByLabelText('Волонтер')).toBeNull();

    await rerender(<MasterCard {...master} volunteer />);
    expect(screen.getByLabelText('Волонтер')).toBeTruthy();
  });

  it('shows initials when there is no photo', async () => {
    await render(<MasterCard {...master} />);

    expect(screen.getByText('АМ')).toBeTruthy();
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<MasterCard {...master} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('getInitials', () => {
  it('takes the first letters of the first two words', () => {
    expect(getInitials('Андрій Мельник')).toBe('АМ');
    expect(getInitials('  олена  ')).toBe('О');
  });
});