import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from '../components/ErrorState';
import { useTheme } from '../src/theme';

// Екран 22 «Помилка — немає з'єднання»: вміст 32 від країв, по центру екрана
const CONTENT_INSET = 32;

export const OFFLINE_TITLE = "Немає з'єднання";
export const OFFLINE_TEXT =
  'Перевірте інтернет і спробуйте ще раз. Ваша заявка не загубиться.';
export const OFFLINE_RETRY = 'Спробувати ще раз';

export type OfflineScreenProps = {
  onRetry: () => void;
  /** Спінер на кнопці, поки перевіряємо з'єднання */
  retrying?: boolean;
};

export default function OfflineScreen({
  onRetry,
  retrying = false,
}: OfflineScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      testID="offline-screen"
      accessibilityViewIsModal
      style={[
        styles.screen,
        {
          backgroundColor: theme.colors.bg.screen,
          paddingTop: insets.top + theme.spacing.lg,
          paddingBottom: insets.bottom + theme.spacing.lg,
        },
      ]}
    >
      <ErrorState
        title={OFFLINE_TITLE}
        text={OFFLINE_TEXT}
        icon="circle-alert"
        actionLabel={OFFLINE_RETRY}
        onAction={onRetry}
        actionLoading={retrying}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: CONTENT_INSET,
  },
});
