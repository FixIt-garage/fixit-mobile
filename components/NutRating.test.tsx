import { fireEvent, render, screen } from '@testing-library/react-native';
import { NutRating } from './NutRating';

describe('NutRating', () => {
  describe('display mode', () => {
    it('renders the rating value', async () => {
      await render(<NutRating mode="display" rating={4.8} />);

      expect(screen.getByText('4.8')).toBeTruthy();
    });

    it('has an accessible rating label', async () => {
      await render(<NutRating mode="display" rating={4.8} />);

      expect(screen.getByLabelText('Рейтинг 4.8')).toBeTruthy();
    });
  });

  describe('input mode', () => {
    it('renders five rating options', async () => {
      await render(
        <NutRating mode="input" value={3} onChange={() => {}} />,
      );

      expect(screen.getAllByRole('radio')).toHaveLength(5);
    });

    it('marks the selected rating', async () => {
      await render(
        <NutRating mode="input" value={3} onChange={() => {}} />,
      );

      expect(screen.getByLabelText('3 з 5').props.accessibilityState).toEqual({
        selected: true,
      });
    });

    it('calls onChange when a rating is pressed', async () => {
      const onChange = jest.fn();

      await render(<NutRating mode="input" value={2} onChange={onChange} />);

      fireEvent.press(screen.getByLabelText('4 з 5'));

      expect(onChange).toHaveBeenCalledWith(4);
    });
  });
});
