import type { TextStyle } from 'react-native';
import { fonts } from './fonts';

// Letter spacing у Figma задано у %, у React Native — у пунктах:
// letterSpacing = fontSize × відсоток / 100
export const typography = {
  display: {
    fontFamily: fonts.unboundedBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.64, // -2%
  },
  h1: {
    fontFamily: fonts.unboundedSemiBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.48, // -2%
  },
  h2: {
    fontFamily: fonts.unboundedSemiBold,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.38, // -2%
  },
  h3: { fontFamily: fonts.onestSemiBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.onestRegular, fontSize: 16, lineHeight: 22 },
  bodyBold: { fontFamily: fonts.onestSemiBold, fontSize: 16, lineHeight: 22 },
  bodySmall: { fontFamily: fonts.onestRegular, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.onestRegular, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fonts.onestSemiBold, fontSize: 16, lineHeight: 20 },
  labelMono: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.44, // 4%
    textTransform: 'uppercase',
  },
  labelMonoBold: {
    fontFamily: fonts.monoBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.44, // 4%
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;