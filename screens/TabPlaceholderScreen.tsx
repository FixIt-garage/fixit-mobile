import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { useTheme } from '../src/theme';

const TAB_BAR_HEIGHT = 64;

type Props = {
  title: string;
  children?: ReactNode;
};

export default function TabPlaceholderScreen({ title, children }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bg.screen,
          paddingTop: insets.top,
          paddingHorizontal: theme.layout.screenPadding,
          paddingBottom: TAB_BAR_HEIGHT + Math.max(insets.bottom, theme.layout.bottomInset),
          gap: theme.spacing.sm,
        },
      ]}
    >
      <Text variant="h2">{title}</Text>
      <Text color="secondary">Екран ще не реалізовано</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});