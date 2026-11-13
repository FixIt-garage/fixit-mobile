import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from './Text';
import { Card } from './Card';

describe('Card', () => {
  it('renders its content', async () => {
    await render(
      <Card>
        <Text>Вміст картки</Text>
      </Card>,
    );

    expect(screen.getByText('Вміст картки')).toBeTruthy();
  });

  it('is not a button without onPress', async () => {
    await render(
      <Card>
        <Text>Вміст картки</Text>
      </Card>,
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();

    await render(
      <Card onPress={onPress} accessibilityLabel="Відкрити картку">
        <Text>Вміст картки</Text>
      </Card>,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Відкрити картку' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});