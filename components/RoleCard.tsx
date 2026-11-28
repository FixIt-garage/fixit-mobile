import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, type GradientName } from '../src/theme';
import { Button } from './Button';
import { Text } from './Text';

export const ROLE_CARD_WIDTH = 296;
const CARD_WIDTH = ROLE_CARD_WIDTH;
const CARD_RADIUS = 28;
const HERO_HEIGHT = 236;
const GRID_STEP = 24;
const TITLE_MIN_SCALE = 0.7;

export type RoleCardProps = {
  kicker: string;
  title: string;
  description: string;
  buttonLabel: string;
  gradient: GradientName;
  icon?: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function RoleCard({
  kicker,
  title,
  description,
  buttonLabel,
  gradient,
  icon,
  onPress,
  style,
}: RoleCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          padding: theme.spacing.md,
          gap: theme.spacing.md,
          borderColor: theme.colors.border.default,
          backgroundColor: theme.colors.bg.surface,
        },
        style,
      ]}
    >
      <View style={[styles.hero, { borderRadius: theme.radius.xl }]}>
        <LinearGradient
          colors={theme.gradients[gradient]}
          start={theme.gradientDirection.start}
          end={theme.gradientDirection.end}
          style={StyleSheet.absoluteFill}
        />
        <BlueprintGrid color={theme.colors.glass.grid} />
        <Text
          variant="labelMono"
          color="onInverse"
          style={[styles.kicker, { top: theme.spacing.lg, left: theme.spacing.lg }]}
        >
          {kicker}
        </Text>
        {icon}
      </View>

      <View style={{ paddingHorizontal: theme.spacing.sm, gap: theme.spacing.xs }}>
        <Text
          variant="h2"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={TITLE_MIN_SCALE}
        >
          {title}
        </Text>
        <Text variant="body" color="secondary">
          {description}
        </Text>
      </View>

      <Button label={buttonLabel} gradient={gradient} onPress={onPress} />
    </View>
  );
}

function BlueprintGrid({ color }: { color: string }) {
  const columns = Math.ceil(CARD_WIDTH / GRID_STEP);
  const rows = Math.ceil(HERO_HEIGHT / GRID_STEP);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: columns }, (_, i) => (
        <View
          key={`v${i}`}
          style={[styles.vLine, { left: (i + 1) * GRID_STEP, backgroundColor: color }]}
        />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <View
          key={`h${i}`}
          style={[styles.hLine, { top: (i + 1) * GRID_STEP, backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
  },
  hero: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    position: 'absolute',
  },
  vLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  hLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
});