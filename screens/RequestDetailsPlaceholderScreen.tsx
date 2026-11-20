import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../components/Button';
import { Text } from '../components/Text';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../src/theme';

type Props = NativeStackScreenProps<MainStackParamList, 'RequestDetails'>;

export default function RequestDetailsPlaceholderScreen({
  navigation,
  route,
}: Props) {
  const theme = useTheme();
  const { issueId, title } = route.params;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.bg.screen }]}
    >
      <Text variant="h1">Деталі заявки</Text>
      <Text variant="body" color="secondary">
        Заявка №{issueId}
      </Text>
      <Text variant="body">{title}</Text>

      <Button
        label="Назад до заявок"
        variant="secondary"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});
