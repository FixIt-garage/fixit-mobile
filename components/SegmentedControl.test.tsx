import { fireEvent, render, screen } from '@testing-library/react-native';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'masters', label: 'Майстри' },
  { value: 'services', label: 'Сервіси' },
] as const;

describe('SegmentedControl', () => {
  it('marks the current value as selected', async () => {
    await render(<SegmentedControl options={options} value="masters" onChange={jest.fn()} />);

    expect(screen.getByRole('tab', { name: 'Майстри', selected: true })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Сервіси', selected: false })).toBeTruthy();
  });

  it('calls onChange with the pressed option value', async () => {
    const onChange = jest.fn();
    await render(<SegmentedControl options={options} value="masters" onChange={onChange} />);

    await fireEvent.press(screen.getByRole('tab', { name: 'Сервіси' }));
    expect(onChange).toHaveBeenCalledWith('services');
  });

  it('does not call onChange when the selected segment is pressed again', async () => {
    const onChange = jest.fn();
    await render(<SegmentedControl options={options} value="masters" onChange={onChange} />);

    await fireEvent.press(screen.getByRole('tab', { name: 'Майстри' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});