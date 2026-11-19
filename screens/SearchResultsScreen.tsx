import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../src/theme';
import { BackBar } from '../components/BackBar';
import { Text } from '../components/Text';

type Props = NativeStackScreenProps<MainStackParamList, 'SearchResults'>;

export default function SearchResultsScreen({ route }: Props) {
  const theme = useTheme();
  const { city, description } = route.params;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}>
      <BackBar title="Результати" />
      <View style={{ padding: theme.layout.screenPadding, gap: theme.spacing.sm }}>
        <Text variant="body">Екран ще не реалізовано</Text>
        <Text variant="bodySmall" color="secondary">
          {[city, description].filter(Boolean).join(' · ')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});