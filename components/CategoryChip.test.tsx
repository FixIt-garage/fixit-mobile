
import { fireEvent, render, screen } from '@testing-library/react-native';
import { CategoryChip } from './CategoryChip';

describe('CategoryChip', () => {
  it('renders the category label', async () => {
    await render(
      <CategoryChip
        label="Побутова техніка"
        selected={false}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText('Побутова техніка')).toBeTruthy();
  });

  it('exposes selected state', async () => {
    await render(
      <CategoryChip
        label="Побутова техніка"
        selected
        onPress={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Побутова техніка',
        selected: true,
      }),
    ).toBeTruthy();
  });

  it('exposes unselected state', async () => {
    await render(
      <CategoryChip
        label="Побутова техніка"
        selected={false}
        onPress={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Побутова техніка',
        selected: false,
      }),
    ).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();

    await render(
      <CategoryChip
        label="Побутова техніка"
        selected={false}
        onPress={onPress}
      />,
    );

    await fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
