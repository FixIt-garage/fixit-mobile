import { fireEvent, render, screen } from '@testing-library/react-native';
import { NutRating } from './NutRating';

describe('NutRating', () => {
  describe('display mode', () => {
    it('renders the rating value', async () => {
      await render(<NutRating mode="display" rating={4.8} />);

      expect(screen.getByText('4,8')).toBeTruthy();
    });

    it('has an accessible rating label', async () => {
      await render(<NutRating mode="display" rating={4.8} />);

      expect(screen.getByLabelText('Рейтинг 4,8')).toBeTruthy();
    });
  });

  describe('input mode', () => {
    it('renders five rating options', async () => {
      await render(
        <NutRating mode="input" value={3} onChange={() => {}} />,
      );

      for (let rating = 1; rating <= 5; rating++) {
        expect(screen.getByTestId(`nut-rating-${rating}`)).toBeTruthy();
      }
    });

    it('has adjustable accessibility role and current value', async () => {
      await render(
        <NutRating mode="input" value={3} onChange={() => {}} />,
      );

      const rating = screen.getByRole('adjustable');

      expect(rating.props.accessibilityLabel).toBe('Оцініть роботу');
      expect(rating.props.accessibilityValue).toEqual({
        min: 1,
        max: 5,
        now: 3,
        text: '3 з 5',
      });
    });

    it('calls onChange when a rating nut is pressed', async () => {
      const onChange = jest.fn();

      await render(
        <NutRating mode="input" value={2} onChange={onChange} />,
      );

      fireEvent.press(screen.getByTestId('nut-rating-4'));

      expect(onChange).toHaveBeenCalledWith(4);
    });

    it.each([
      ['increment', 2, 3],
      ['decrement', 3, 2],
      ['increment', 0, 1],
    ] as const)(
      'handles accessibility action "%s" from %i to %i',
      async (actionName, value, expected) => {
        const onChange = jest.fn();

        await render(
          <NutRating mode="input" value={value} onChange={onChange} />,
        );

        fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
          nativeEvent: { actionName },
        });

        expect(onChange).toHaveBeenCalledWith(expected);
      },
    );

    it.each([
      ['increment', 5],
      ['decrement', 1],
    ] as const)(
      'does not exceed rating boundaries for "%s" at %i',
      async (actionName, value) => {
        const onChange = jest.fn();

        await render(
          <NutRating mode="input" value={value} onChange={onChange} />,
        );

        fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
          nativeEvent: { actionName },
        });

        expect(onChange).not.toHaveBeenCalled();
      },
    );
  });
});
