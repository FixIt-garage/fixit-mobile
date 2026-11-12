
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';

export type MonoTagProps = {
  label: string;
};

export function MonoTag({ label }: MonoTagProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bg.successSoft,
          borderRadius: theme.radius.pill,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text
        variant="labelMonoBold"
        color="success"
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
