import { useFonts } from 'expo-font';
import { Unbounded_600SemiBold, Unbounded_700Bold } from '@expo-google-fonts/unbounded';
import { Onest_400Regular, Onest_600SemiBold } from '@expo-google-fonts/onest';
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';

// Кожна товщина — окремий шрифт зі своєю назвою.
// Ці назви використовуються в typography.ts.
export const fonts = {
  unboundedSemiBold: 'Unbounded_600SemiBold',
  unboundedBold: 'Unbounded_700Bold',
  onestRegular: 'Onest_400Regular',
  onestSemiBold: 'Onest_600SemiBold',
  monoMedium: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

// Завантажує всі шрифти теми. Повертає [loaded, error].
export function useAppFonts() {
  return useFonts({
    [fonts.unboundedSemiBold]: Unbounded_600SemiBold,
    [fonts.unboundedBold]: Unbounded_700Bold,
    [fonts.onestRegular]: Onest_400Regular,
    [fonts.onestSemiBold]: Onest_600SemiBold,
    [fonts.monoMedium]: JetBrainsMono_500Medium,
    [fonts.monoBold]: JetBrainsMono_700Bold,
  });
}