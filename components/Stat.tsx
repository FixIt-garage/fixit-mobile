import { StyleSheet, View } from 'react-native';
import { Text } from './Text';

export type StatProps = {
  value: string;
  label: string;
};

export function Stat({ value, label }: StatProps) {
  return (
    <View style={styles.container}>
      <Text variant="h2" color="primary">
        {value}
      </Text>

      <Text variant="caption" color="secondary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
});