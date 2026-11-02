import type { ViewStyle } from 'react-native';

export const shadows = {
  floating: {
    shadowColor: '#121726',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 12, // Blur 24 у Figma ≈ 12 на iOS
  },
  // Кружечок Toggle: X 0, Y 1, Blur 2, #000000 15%
  knob: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1, // Blur 2 у Figma
  },
  // Вибраний сегмент SegmentedControl: X 0, Y 1, Blur 3, #000000 8%
  segment: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5, // Blur 3 у Figma
  },
    // Shadow/Card: X 0, Y 4, Blur 16, #121726 6% (IconButton white, картки)
  card: {
    shadowColor: '#121726',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8, // Blur 16 у Figma
  },
} satisfies Record<string, ViewStyle>;