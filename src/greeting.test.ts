import { greeting, toVocative } from './greeting';

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