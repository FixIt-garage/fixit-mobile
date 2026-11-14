import { fireEvent, render, screen } from '@testing-library/react-native';
import { GlassIconButton } from './GlassIconButton';

describe('GlassIconButton', () => {
  it('is an accessible button that calls onPress', async () => {
    const onPress = jest.fn();
    await render(
      <GlassIconButton icon="pencil" accessibilityLabel="Редагувати профіль" onPress={onPress} />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Редагувати профіль' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});