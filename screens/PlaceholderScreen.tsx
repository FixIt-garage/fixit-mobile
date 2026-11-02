import { StyleSheet, View } from 'react-native';

import { Text } from '../components/Text';
import { useTheme } from '../src/theme';

type Props = {
  route: { name: string };
};

export default function PlaceholderScreen({ route }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.bg.screen },
      ]}
    >
      <Text variant="h2">{route.name}</Text>
      <Text color="secondary" style={styles.hint}>
        Екран ще не реалізовано
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  hint: {
    marginTop: 8,
  },
});