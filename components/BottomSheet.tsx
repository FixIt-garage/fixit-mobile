import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme';

export const BOTTOM_SHEET_RADIUS = 32;

export type BottomSheetProps = {
  children: ReactNode;
  background?: 'surface' | 'screen';
  handle?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BottomSheet({
  children,
  background = 'surface',
  handle = false,
  style,
}: BottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor:
            background === 'surface' ? theme.colors.bg.surface : theme.colors.bg.screen,
          paddingTop: theme.spacing.md,
          paddingHorizontal: theme.layout.screenPadding,
          paddingBottom: Math.max(insets.bottom, theme.layout.bottomInset),
          gap: theme.spacing.md,
        },
        style,
      ]}
    >
      {handle ? (
        <View
          testID="bottom-sheet-handle"
          style={[styles.handle, { backgroundColor: theme.colors.border.default }]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: BOTTOM_SHEET_RADIUS,
    borderTopRightRadius: BOTTOM_SHEET_RADIUS,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});