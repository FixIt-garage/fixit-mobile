import { fireEvent, render, screen } from '@testing-library/react-native';
import { VolunteerCard } from './VolunteerCard';

describe('VolunteerCard', () => {
  it('shows the texts', async () => {
    await render(<VolunteerCard value onChange={jest.fn()} />);

    expect(screen.getByText('Я волонтер')).toBeTruthy();
    expect(screen.getByText('Клієнти бачать прапорець біля імені')).toBeTruthy();
  });

  it('switches the value', async () => {
    const onChange = jest.fn();
    await render(<VolunteerCard value onChange={onChange} />);

    await fireEvent.press(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledWith(false);
  });
});