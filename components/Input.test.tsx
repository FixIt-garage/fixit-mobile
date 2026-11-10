import { fireEvent, render, screen } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input', () => {
  it('shows label and helper and reports typed text', async () => {
    const onChangeText = jest.fn();
    await render(
      <Input label="Що зламалося?" helper="Наприклад: пральна машина" onChangeText={onChangeText} />,
    );

    expect(screen.getByText('Наприклад: пральна машина')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Що зламалося?'), 'пральна');
    expect(onChangeText).toHaveBeenCalledWith('пральна');
  });

  it('shows the error instead of the helper', async () => {
    await render(<Input label="Телефон" helper="Формат +380" error="Невірний номер" />);

    expect(screen.getByText('Невірний номер')).toBeTruthy();
    expect(screen.queryByText('Формат +380')).toBeNull();
  });

  it('toggles password visibility, icon and label on each press', async () => {
    await render(<Input label="Пароль" password />);

    expect(screen.getByLabelText('Пароль').props.secureTextEntry).toBe(true);
    expect(screen.getByTestId('password-icon-eye-off')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Показати пароль' }));
    expect(screen.getByLabelText('Пароль').props.secureTextEntry).toBe(false);
    expect(screen.getByTestId('password-icon-eye')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Сховати пароль' }));
    expect(screen.getByLabelText('Пароль').props.secureTextEntry).toBe(true);
    expect(screen.getByTestId('password-icon-eye-off')).toBeTruthy();
  });

  it('still calls the parent onFocus and onBlur', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    await render(<Input label="Імʼя" onFocus={onFocus} onBlur={onBlur} />);

    await fireEvent(screen.getByLabelText('Імʼя'), 'focus');
    await fireEvent(screen.getByLabelText('Імʼя'), 'blur');
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});