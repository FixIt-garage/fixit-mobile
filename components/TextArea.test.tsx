import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('counts typed characters', async () => {
    await render(<TextArea label="Що зламалося?" maxLength={500} />);

    expect(screen.getByText('0/500')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Що зламалося?'), 'привіт');
    expect(screen.getByText('6/500')).toBeTruthy();
  });

  it('counts a controlled value', async () => {
    await render(<TextArea label="Опис" value="abc" maxLength={10} onChangeText={jest.fn()} />);
    expect(screen.getByText('3/10')).toBeTruthy();
  });

  it('limits input length and still calls onChangeText', async () => {
    const onChangeText = jest.fn();
    await render(<TextArea label="Опис" maxLength={500} onChangeText={onChangeText} />);

    const input = screen.getByLabelText('Опис');
    expect(input.props.maxLength).toBe(500);
    await fireEvent.changeText(input, 'текст');
    expect(onChangeText).toHaveBeenCalledWith('текст');
  });

  it('shows the error message', async () => {
    await render(<TextArea label="Опис" error="Опишіть поломку" />);
    expect(screen.getByText('Опишіть поломку')).toBeTruthy();
  });
});