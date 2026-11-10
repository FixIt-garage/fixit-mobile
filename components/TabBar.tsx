import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme';
import type { IconName } from './Icon/Icon';
import { TabItem } from './TabItem';

const HEIGHT = 64;

export type TabBarTab<K extends string = string> = {
  key: K;
  label: string;
  icon: IconName;
};

export type TabBarProps<K extends string = string> = {
  tabs: readonly TabBarTab<K>[];
  activeKey: K;
  onTabPress: (key: K) => void;
  floating?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function TabBar<K extends string>({
  tabs,
  activeKey,
  onTabPress,
  floating = true,
  style,
}: TabBarProps<K>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        floating && [
          styles.floating,
          {
            paddingHorizontal: theme.layout.floatingInset,
            paddingBottom: Math.max(insets.bottom, theme.layout.bottomInset),
          },
        ],
        style,
      ]}
    >
      <View
        accessibilityRole="tablist"
        style={[
          styles.capsule,
          {
            height: HEIGHT,
            padding: theme.spacing.sm,
            borderRadius: theme.radius.pill,
            backgroundColor: theme.colors.bg.inverse,
          },
          theme.shadows.floating,
        ]}
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            active={tab.key === activeKey}
            onPress={() => onTabPress(tab.key)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});