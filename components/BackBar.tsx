import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme';
import { Text } from './Text';

// Зона натискання кнопки «назад» (мінімум Apple для пальця)
const HIT_SIZE = 44;

export type BackBarProps = {
  title: string;
  /** За замовчуванням — navigation.goBack() */
  onBack?: () => void;
  /** Необовʼязкова дія праворуч, наприклад IconButton */
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BackBar({ title, onBack, right, style }: BackBarProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    // paddingTop = висота статус-бару/вирізу, щоб панель не заходила під них
    <View style={[{ paddingTop: insets.top, backgroundColor: theme.colors.bg.surface }, style]}>
      <View
        style={[
          styles.row,
          {
            height: theme.layout.topBarHeight,
            paddingLeft: theme.spacing.xs,
            paddingRight: theme.spacing.lg,
            gap: theme.spacing.xs,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          onPress={onBack ?? (() => navigation.goBack())}
          style={styles.back}
        >
          {/* TODO: замінити на Icon chevron-left з FIX-16 */}
          <View style={[styles.chevron, { borderColor: theme.colors.icon.default }]} />
        </Pressable>

        <Text variant="h3" accessibilityRole="header" numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: HIT_SIZE,
    height: HIT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Шеврон ‹: кут із двох сторін рамки, повернутий на 45°
  chevron: {
    width: 9,
    height: 9,
    marginLeft: 3,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    flex: 1,
  },
});