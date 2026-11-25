import { ISSUE_TITLE_MAX, issueTitleFromDescription } from './issueDraft';

describe('issueTitleFromDescription', () => {
  it('uses the first sentence without the final dot', () => {
    expect(
      issueTitleFromDescription('Пральна машина не зливає воду. Почалось після прання.'),
    ).toBe('Пральна машина не зливає воду');
  });

  it('keeps a question or exclamation mark', () => {
    expect(issueTitleFromDescription('Чому гуде холодильник? Вночі дуже чутно')).toBe(
      'Чому гуде холодильник?',
    );
  });

  it('uses only the first line', () => {
    expect(issueTitleFromDescription('Тече змішувач\nу ванній кімнаті')).toBe('Тече змішувач');
  });

  it('returns short text as is', () => {
    expect(issueTitleFromDescription('  Розбитий екран  ')).toBe('Розбитий екран');
  });

  it('does not treat a dot inside a model name as the end of a sentence', () => {
    expect(issueTitleFromDescription('Не вмикається ноутбук v2.1 після оновлення')).toBe(
      'Не вмикається ноутбук v2.1 після оновлення',
    );
  });

  it('cuts long text on a word boundary', () => {
    const title = issueTitleFromDescription(
      'Пральна машина Bosch Serie 4 перестала зливати воду і видає помилку на екрані щоразу',
    );

    expect(title.length).toBeLessThanOrEqual(ISSUE_TITLE_MAX + 1);
    expect(title.endsWith('…')).toBe(true);
    expect(title).toBe('Пральна машина Bosch Serie 4 перестала зливати воду і видає…');
  });
});