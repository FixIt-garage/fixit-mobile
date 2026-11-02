import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { IconButton } from './IconButton';
import { theme } from '../src/theme';

describe('IconButton', () => {
  it('is announced by its label and calls onPress', async () => {
    const onPress = jest.fn();
    await render(
      <IconButton accessibilityLabel="Назад" icon={() => <Text>‹</Text>} onPress={onPress} />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Назад' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('gives a white icon color on glass', async () => {
    const icon = jest.fn(() => <Text>‹</Text>);
    await render(<IconButton variant="glass" accessibilityLabel="Назад" icon={icon} />);
    expect(icon).toHaveBeenCalledWith(theme.colors.text.onBrand);
  });

  it('gives the default icon color on white', async () => {
    const icon = jest.fn(() => <Text>‹</Text>);
    await render(<IconButton variant="white" accessibilityLabel="Назад" icon={icon} />);
    expect(icon).toHaveBeenCalledWith(theme.colors.icon.default);
  });
});