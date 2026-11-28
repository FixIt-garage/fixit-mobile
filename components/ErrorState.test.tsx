import { fireEvent, render, screen } from '@testing-library/react-native';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('shows the title, text and illustration', async () => {
    await render(
      <ErrorState
        title="Немає з'єднання"
        text="Перевірте інтернет і спробуйте ще раз."
      />,
    );

    expect(
      screen.getByRole('header', { name: "Немає з'єднання" }),
    ).toBeTruthy();
    expect(
      screen.getByText('Перевірте інтернет і спробуйте ще раз.'),
    ).toBeTruthy();
    expect(screen.getByTestId('error-state-illustration')).toBeTruthy();
  });

  it('calls onAction when the button is pressed', async () => {
    const onAction = jest.fn();
    await render(
      <ErrorState
        title="Немає з'єднання"
        actionLabel="Спробувати ще раз"
        onAction={onAction}
      />,
    );

    await fireEvent.press(
      screen.getByRole('button', { name: 'Спробувати ще раз' }),
    );

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('hides the button without an action', async () => {
    await render(
      <ErrorState title="Щось пішло не так" actionLabel="Повторити" />,
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('blocks the button while retrying', async () => {
    const onAction = jest.fn();
    await render(
      <ErrorState
        title="Немає з'єднання"
        actionLabel="Спробувати ще раз"
        onAction={onAction}
        actionLoading
      />,
    );

    const button = screen.getByRole('button', { name: 'Спробувати ще раз' });
    expect(button.props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });

    await fireEvent.press(button);
    expect(onAction).not.toHaveBeenCalled();
  });
});
