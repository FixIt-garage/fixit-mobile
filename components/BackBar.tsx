import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme';
import { Icon } from './Icon/Icon';
import { Text } from './Text';

const HIT_SIZE = 44;

export type BackBarProps = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BackBar({ title, onBack, right, style }: BackBarProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
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
          <Icon name="chevron-left" color="icon/default" />
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
  title: {
    flex: 1,
  },
});