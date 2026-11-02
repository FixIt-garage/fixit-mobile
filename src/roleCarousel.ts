import { ROLE_CARD_WIDTH } from '../components/RoleCard';

export const CARD_GAP = 16;
export const SNAP = ROLE_CARD_WIDTH + CARD_GAP;
export function carouselEndPadding(viewportWidth: number, sidePadding: number) {
  return Math.max(viewportWidth - ROLE_CARD_WIDTH - sidePadding, sidePadding);
}
export function activeIndexForOffset(offsetX: number, count: number) {
  const index = Math.round(offsetX / SNAP);
  return Math.min(Math.max(index, 0), count - 1);
}