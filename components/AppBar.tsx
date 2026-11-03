import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme';
import { Text } from './Text';

// Зона натискання пошуку з Figma
const SEARCH_HIT = 48;

export type AppBarProps = {
  title: string;
  /** На глибоких екранах пошук вимикають */
  showSearch?: boolean;
  onSearchPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AppBar({ title, showSearch = true, onSearchPress, style }: AppBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const iconColor = theme.colors.icon.default;

  return (
    <View style={[{ paddingTop: insets.top, backgroundColor: theme.colors.bg.surface }, style]}>
      <View
        style={[
          styles.row,
          {
            height: theme.layout.topBarHeight,
            paddingLeft: theme.spacing.lg,
            paddingRight: theme.spacing.sm,
          },
        ]}
      >
        <Text variant="h3" accessibilityRole="header" numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        {showSearch ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Пошук"
            onPress={onSearchPress}
            style={styles.search}
          >
            {/* TODO: замінити на Icon search з FIX-16 */}
            <View style={styles.magnifier}>
              <View style={[styles.lens, { borderColor: iconColor }]} />
              <View style={[styles.handle, { backgroundColor: iconColor }]} />
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
  search: {
    width: SEARCH_HIT,
    height: SEARCH_HIT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Тимчасова лупа: коло + ручка під кутом
  magnifier: {
    width: 18,
    height: 18,
  },
  lens: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
  },
  handle: {
    position: 'absolute',
    right: 1,
    bottom: 0,
    width: 2,
    height: 6,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
});