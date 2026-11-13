import {
  formatRating,
  formatReviews,
  formatShortDate,
  formatShortDateTime,
  pluralUk,
} from './format';

describe('formatRating', () => {
  it('uses a comma and one decimal', () => {
    expect(formatRating(4.8)).toBe('4,8');
    expect(formatRating(5)).toBe('5,0');
  });
});

describe('formatReviews', () => {
  it('picks the right Ukrainian plural form', () => {
    expect(formatReviews(1)).toBe('1 відгук');
    expect(formatReviews(21)).toBe('21 відгук');
    expect(formatReviews(2)).toBe('2 відгуки');
    expect(formatReviews(32)).toBe('32 відгуки');
    expect(formatReviews(5)).toBe('5 відгуків');
    expect(formatReviews(11)).toBe('11 відгуків');
    expect(formatReviews(14)).toBe('14 відгуків');
    expect(formatReviews(0)).toBe('0 відгуків');
  });
});

describe('formatShortDate', () => {
  it('formats day and short Ukrainian month', () => {
    expect(formatShortDate(new Date(2026, 9, 21))).toBe('21 жовт.');
    expect(formatShortDate(new Date(2026, 0, 3))).toBe('3 січ.');
  });
});

describe('formatShortDateTime', () => {
  it('adds time with leading zeros', () => {
    expect(formatShortDateTime(new Date(2026, 9, 26, 10, 0))).toBe('26 жовт., 10:00');
    expect(formatShortDateTime(new Date(2026, 9, 26, 9, 5))).toBe('26 жовт., 09:05');
  });
});

describe('pluralUk', () => {
  it('picks one, few or many', () => {
    expect(pluralUk(1, 'майстер', 'майстри', 'майстрів')).toBe('майстер');
    expect(pluralUk(3, 'майстер', 'майстри', 'майстрів')).toBe('майстри');
    expect(pluralUk(5, 'майстер', 'майстри', 'майстрів')).toBe('майстрів');
  });
});