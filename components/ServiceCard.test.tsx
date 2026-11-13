import { fireEvent, render, screen } from '@testing-library/react-native';
import { ServiceCard } from './ServiceCard';

const service = {
  name: 'ТехноСервіс',
  address: 'вул. Городоцька, 15',
  rating: 4.6,
  hours: 'Відчинено до 19:00',
};

describe('ServiceCard', () => {
  it('shows name, address, hours and rating', async () => {
    await render(<ServiceCard {...service} />);

    expect(screen.getByText('ТехноСервіс')).toBeTruthy();
    expect(screen.getByText('вул. Городоцька, 15')).toBeTruthy();
    expect(screen.getByText('Відчинено до 19:00')).toBeTruthy();
    expect(screen.getByText('4,6')).toBeTruthy();
  });

  it('hides hours when they are not provided', async () => {
    await render(<ServiceCard {...service} hours={undefined} />);

    expect(screen.queryByText('Відчинено до 19:00')).toBeNull();
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<ServiceCard {...service} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});