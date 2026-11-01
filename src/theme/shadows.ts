import type { ViewStyle } from 'react-native';

// Shadow/Floating з Figma: X 0, Y 8, Blur 24, Spread 0, #121726 14%
// Тільки для плаваючих елементів: капсула таб-бару, іконка застосунку.
export const shadows = {
  floating: {
    shadowColor: '#121726',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 12, // Blur 24 у Figma ≈ 12 на iOS
  },
} satisfies Record<string, ViewStyle>;