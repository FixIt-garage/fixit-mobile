import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('shows the label and calls onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Надіслати" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Надіслати' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Надіслати" disabled onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a spinner instead of the label and blocks presses while loading', async () => {
    const onPress = jest.fn();
    await render(<Button label="Надіслати" loading onPress={onPress} />);

    expect(screen.getByTestId('button-loading')).toBeTruthy();
    expect(screen.queryByText('Надіслати')).toBeNull();

    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders an optional icon', async () => {
    await render(<Button label="Надіслати" icon={<Text testID="icon">★</Text>} />);
    expect(screen.getByTestId('icon')).toBeTruthy();
  });
});

// Простий Text для іконки-заглушки в тесті
