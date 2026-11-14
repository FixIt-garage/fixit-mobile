import { useState, type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../src/theme';
import { BlueprintGrid } from './BlueprintGrid';
import { Glow } from './Glow';

const RADIUS = 32;
const CONTENT_GAP = 14;

export type HeroCardAccent = 'client' | 'master';

export type HeroCardProps = {
  children: ReactNode;
  accent?: HeroCardAccent;
  style?: StyleProp<ViewStyle>;
};

export function HeroCard({ children, accent = 'client', style }: HeroCardProps) {
  const theme = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.bg.inverse,
          paddingTop: theme.spacing.md,
          paddingHorizontal: theme.layout.screenPadding,
          paddingBottom: theme.layout.screenPadding,
          gap: CONTENT_GAP,
        },
        style,
      ]}
    >
      <Glow color={theme.colors.role[accent]} style={styles.glow} />
      {size.width > 0 ? (
        <BlueprintGrid
          width={size.width}
          height={size.height}
          offset={8}
          color={theme.colors.glass.grid}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -200,
    right: -130,
  },
});