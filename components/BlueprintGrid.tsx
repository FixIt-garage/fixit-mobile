import { StyleSheet, View } from 'react-native';

export type BlueprintGridProps = {
  width: number;
  height: number;
  color: string;
  step?: number;
  offset?: number;
};

export function BlueprintGrid({ width, height, color, step = 24, offset = 0 }: BlueprintGridProps) {
  const columns = Math.ceil((width - offset) / step);
  const rows = Math.ceil((height - offset) / step);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: columns }, (_, i) => (
        <View
          key={`v${i}`}
          style={[styles.vLine, { left: offset + i * step, backgroundColor: color }]}
        />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <View
          key={`h${i}`}
          style={[styles.hLine, { top: offset + i * step, backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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