import { fireEvent, render, screen } from '@testing-library/react-native';
import { RequestCard } from './RequestCard';

const request = {
  category: 'Побутова техніка',
  title: 'Пральна машина не зливає воду',
  status: 'accepted' as const,
  date: new Date(2026, 9, 21),
  author: 'Андрій Мельник',
};

describe('RequestCard', () => {
  it('shows category, title, status and meta', async () => {
    await render(<RequestCard {...request} />);

    expect(screen.getByText('Побутова техніка')).toBeTruthy();
    expect(screen.getByText('Пральна машина не зливає воду')).toBeTruthy();
    expect(screen.getByText('ПРИЙНЯТА')).toBeTruthy();
    expect(screen.getByText('Андрій Мельник · 21 жовт.')).toBeTruthy();
  });

  it('shows only the date when there is no author', async () => {
    await render(<RequestCard {...request} author={undefined} />);

    expect(screen.getByText('21 жовт.')).toBeTruthy();
  });

  it('renders every status', async () => {
    const { rerender } = await render(<RequestCard {...request} status="sent" />);
    expect(screen.getByText('НАДІСЛАНА')).toBeTruthy();

    await rerender(<RequestCard {...request} status="declined" />);
    expect(screen.getByText('ВІДХИЛЕНА')).toBeTruthy();
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<RequestCard {...request} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});