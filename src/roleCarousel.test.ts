import { ROLE_CARD_WIDTH } from '../components/RoleCard';
import { CARD_GAP, SNAP, activeIndexForOffset, carouselEndPadding } from './roleCarousel';

const SIDE = 20;
const COUNT = 4;

function maxOffset(viewportWidth: number) {
  const cards = COUNT * ROLE_CARD_WIDTH + (COUNT - 1) * CARD_GAP;
  const content = SIDE + cards + carouselEndPadding(viewportWidth, SIDE);
  return content - viewportWidth;
}

describe('role carousel geometry', () => {
  it.each([
    ['iPad', 768],
    ['iPhone', 390],
    ['small iPhone', 320],
  ])('lets the last card snap into place on %s (%i pt)', (_name, width) => {
    const end = maxOffset(width);

    expect(end).toBeGreaterThanOrEqual(SNAP * (COUNT - 1));
    expect(activeIndexForOffset(end, COUNT)).toBe(COUNT - 1);
  });

  it('keeps the index within the list', () => {
    expect(activeIndexForOffset(-50, COUNT)).toBe(0);
    expect(activeIndexForOffset(99999, COUNT)).toBe(COUNT - 1);
  });
});