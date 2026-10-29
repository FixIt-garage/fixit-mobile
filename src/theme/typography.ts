import type { TextStyle } from 'react-native';
import { fonts } from './fonts';

export const typography = {
  display: { fontFamily: fonts.unboundedBold, fontSize: 32, lineHeight: 38 },
  h1: { fontFamily: fonts.unboundedSemiBold, fontSize: 24, lineHeight: 30 },
  h2: { fontFamily: fonts.unboundedSemiBold, fontSize: 19, lineHeight: 24 },
  h3: { fontFamily: fonts.onestSemiBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.onestRegular, fontSize: 16, lineHeight: 22 },
  bodyBold: { fontFamily: fonts.onestSemiBold, fontSize: 16, lineHeight: 22 },
  bodySmall: { fontFamily: fonts.onestRegular, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.onestRegular, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fonts.onestSemiBold, fontSize: 16, lineHeight: 20 },
  labelMono: { fontFamily: fonts.monoMedium, fontSize: 11, lineHeight: 14 },
  labelMonoBold: { fontFamily: fonts.monoBold, fontSize: 11, lineHeight: 14 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;