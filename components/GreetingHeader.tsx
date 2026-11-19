import type { ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../src/theme';
import { BlueprintGrid } from './BlueprintGrid';
import { Glow } from './Glow';
import { Text } from './Text';

const CONTENT_HEIGHT = 172;

export type GreetingHeaderProps = {
  kicker: string;
  title: string;
  action?: ReactNode;
  overlap?: number;
};

export function GreetingHeader({ kicker, title, action, overlap = 0 }: GreetingHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const height = insets.top + CONTENT_HEIGHT;

  return (
    <View
      style={[
        styles.header,
        {
          height,
          backgroundColor: theme.colors.bg.inverse,
          paddingTop: Math.max(insets.top - 3, 0),
          paddingHorizontal: theme.layout.screenPadding,
          paddingBottom: overlap,
        },
      ]}
    >
      <StatusBar style="light" />
      <Glow color={theme.colors.bg.brand} style={[styles.glow, { left: width - 270 }]} />
      <BlueprintGrid width={width} height={height} step={22} offset={22} color={theme.colors.glass.grid} />

      <View style={styles.topRow}>
        <Text variant="labelMono" color="onInverseMuted" numberOfLines={1} style={styles.kicker}>
          {kicker}
        </Text>
        {action}
      </View>

      <Text variant="display" color="onInverse" numberOfLines={2} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -200,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    gap: 8,
  },
  kicker: {
    flex: 1,
  },
});