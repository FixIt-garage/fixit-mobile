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
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Назад"
      onPress={onPress}
      style={styles.back}
    >
      <Icon name="chevron-left" color="icon/default" />
    </Pressable>
  );
}

function NavigationBackButton() {
  const navigation = useNavigation();
  return <BackButton onPress={() => navigation.goBack()} />;
}

export function BackBar({ title, subtitle, onBack, right, style }: BackBarProps) {
  const theme = useTheme();
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
        {onBack ? <BackButton onPress={onBack} /> : <NavigationBackButton />}

        <View style={styles.titleBlock}>
          <Text variant="h3" accessibilityRole="header" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

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
  titleBlock: {
    flex: 1,
  },
});