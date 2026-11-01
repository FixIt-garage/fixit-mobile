import { theme } from './theme';

const HEX = /^#([0-9A-F]{6}|[0-9A-F]{8})$/i;

// Збирає всі рядкові значення з вкладеного обʼєкта
function collectValues(obj: object): string[] {
  return Object.values(obj).flatMap((value) =>
    typeof value === 'object' ? collectValues(value) : [value],
  );
}

describe('theme tokens', () => {
  it('all colors are valid hex', () => {
    for (const color of collectValues(theme.colors)) {
      expect(color).toMatch(HEX);
    }
  });

  it('every gradient has two valid hex stops', () => {
    for (const stops of Object.values(theme.gradients)) {
      expect(stops).toHaveLength(2);
      stops.forEach((stop) => expect(stop).toMatch(HEX));
    }
  });

  it('every text style uses a font that is loaded', () => {
    const loadedFonts = Object.values(theme.fonts);
    for (const style of Object.values(theme.typography)) {
      expect(loadedFonts).toContain(style.fontFamily);
    }
  });

  it('shadow color is valid hex', () => {
    expect(theme.shadows.floating.shadowColor).toMatch(HEX);
  });
});