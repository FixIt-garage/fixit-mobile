import { colors } from './colors';
import { gradients, gradientDirection } from './gradients';
import { fonts } from './fonts';
import { typography } from './typography';
import { spacing, layout } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

export const theme = {
  colors,
  gradients,
  gradientDirection,
  fonts,
  typography,
  spacing,
  layout,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;