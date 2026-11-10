import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme';
import { Icon } from './Icon/Icon';
import { Text } from './Text';

const SEARCH_HIT = 48;
const SEARCH_ICON = 16;

export type AppBarProps = {
  title: string;
  showSearch?: boolean;
  onSearchPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AppBar({ title, showSearch = true, onSearchPress, style }: AppBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
            <Icon name="search" size={SEARCH_ICON} color="icon/default" />
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
});