import { greeting, timeGreeting, timeOfDayGreeting, toVocative } from './greeting';

describe('toVocative', () => {
  it.each([
    ['Олександр', 'Олександре'],
    ['Ігор', 'Ігоре'],
    ['Андрій', 'Андрію'],
    ['Василь', 'Василю'],
    ['Дмитро', 'Дмитре'],
    ['Анна', 'Анно'],
    ['Микола', 'Миколо'],
    ['Марія', 'Маріє'],
    ['Таня', 'Таню'],
    ['John', 'John'],
  ])('%s → %s', (name, expected) => {
    expect(toVocative(name)).toBe(expected);
  });
});

describe('greeting', () => {
  it('greets by name or without it', () => {
    expect(greeting('Олександр')).toBe('Привіт, Олександре');
    expect(greeting('')).toBe('Привіт');
  });
});

describe('timeGreeting', () => {
  it.each([
    [5, 'Доброго ранку'],
    [11, 'Доброго ранку'],
    [12, 'Добрий день'],
    [17, 'Добрий день'],
    [18, 'Добрий вечір'],
    [22, 'Добрий вечір'],
    [23, 'Доброї ночі'],
    [3, 'Доброї ночі'],
  ])('%i:00 → %s', (hour, expected) => {
    expect(timeOfDayGreeting(hour)).toBe(expected);
  });

  it('greets by the time of day and name', () => {
    expect(timeGreeting('Андрій', new Date(2026, 10, 27, 9, 0))).toBe('Доброго ранку, Андрію');
    expect(timeGreeting('', new Date(2026, 10, 27, 20, 0))).toBe('Добрий вечір');
  });
});