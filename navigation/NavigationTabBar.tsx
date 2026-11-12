import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/TabBar';
import { MAIN_TABS, type MainTabKey } from '../src/mainTabs';

export function NavigationTabBar({ state, navigation }: BottomTabBarProps) {
  const activeKey = state.routes[state.index].name as MainTabKey;

  return (
    <TabBar
      tabs={MAIN_TABS}
      activeKey={activeKey}
      onTabPress={(key) => {
        const route = state.routes.find((item) => item.name === key);
        if (!route) {
          return;
        }

        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!event.defaultPrevented && key !== activeKey) {
          navigation.navigate(route.name, route.params);
        }
      }}
    />
  );
}