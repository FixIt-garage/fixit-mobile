import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../src/theme';
import { Card } from './Card';

export type SkeletonCardProps = {
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonCard({ opacity = 1, style }: SkeletonCardProps) {
  const theme = useTheme();
  const [pulse] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.5, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const block = { backgroundColor: theme.colors.bg.subtle };

  return (
    <View testID="skeleton-card" style={[{ opacity }, style]}>
      <Card style={styles.row}>
        <Animated.View style={[styles.avatar, block, { opacity: pulse }]} />
        <Animated.View style={[styles.info, { opacity: pulse }]}>
          <View style={[styles.lineWide, block]} />
          <View style={[styles.lineShort, block]} />
          <View style={[styles.lineTiny, block]} />
        </Animated.View>
        <Animated.View style={[styles.rating, block, { opacity: pulse }]} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  lineWide: {
    width: '70%',
    height: 14,
    borderRadius: 7,
  },
  lineShort: {
    width: '50%',
    height: 12,
    borderRadius: 6,
  },
  lineTiny: {
    width: '30%',
    height: 10,
    borderRadius: 5,
  },
  rating: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});