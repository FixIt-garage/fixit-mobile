import { fireEvent, render, screen } from '@testing-library/react-native';
import { VolunteerRequestCard, formatMastersCount } from './VolunteerRequestCard';

const request = {
  organization: 'БФ «Тепла хата»',
  title: 'Полагодити обігрівачі в притулку',
  date: new Date(2026, 9, 26, 10, 0),
  place: 'Сихів',
  joined: 3,
  needed: 5,
};

describe('VolunteerRequestCard', () => {
  it('shows organization, title, date, place and count', async () => {
    await render(<VolunteerRequestCard {...request} />);

    expect(screen.getByText('БФ «Тепла хата»')).toBeTruthy();
    expect(screen.getByText('Полагодити обігрівачі в притулку')).toBeTruthy();
    expect(screen.getByText('26 жовт., 10:00')).toBeTruthy();
    expect(screen.getByText('Сихів')).toBeTruthy();
    expect(screen.getByText('3 з 5 майстрів')).toBeTruthy();
  });

  it('shows progress as joined out of needed', async () => {
    await render(<VolunteerRequestCard {...request} />);

    expect(screen.getByRole('progressbar').props.accessibilityValue).toMatchObject({ now: 60 });
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<VolunteerRequestCard {...request} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('formatMastersCount', () => {
  it('uses the right form after "з"', () => {
    expect(formatMastersCount(1, 1)).toBe('1 з 1 майстра');
    expect(formatMastersCount(3, 5)).toBe('3 з 5 майстрів');
    expect(formatMastersCount(2, 21)).toBe('2 з 21 майстра');
  });
});