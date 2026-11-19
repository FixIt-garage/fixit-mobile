import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';

export type ProfileStat = {
  label: string;
  value: ReactNode;
};

export function HeroStats({ stats }: { stats: ProfileStat[] }) {
  const theme = useTheme();

  return (
    <>
      <View style={[styles.divider, { backgroundColor: theme.colors.glass.divider }]} />
      <View style={styles.stats}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <View style={styles.valueCell}>
              {typeof stat.value === 'string' || typeof stat.value === 'number' ? (
                <Text variant="h2" color="onInverse" style={styles.statValue} numberOfLines={1}>
                  {stat.value}
                </Text>
              ) : (
                stat.value
              )}
            </View>
            <Text variant="labelMono" color="onInverseMuted" numberOfLines={1}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    gap: 6,
  },
  valueCell: {
    height: 32,
    justifyContent: 'center',
  },
  statValue: {
    lineHeight: 32,
  },
});