import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { action } from 'storybook/actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MAIN_TABS, type MainTabKey } from '../src/mainTabs';
import { AppBar } from './AppBar';
import { SegmentedControl } from './SegmentedControl';
import { TabBar } from './TabBar';

function TabBarWithState({ initial }: { initial: MainTabKey }) {
  const [active, setActive] = useState<MainTabKey>(initial);
  return (
    <TabBar
      tabs={MAIN_TABS}
      activeKey={active}
      floating={false}
      onTabPress={(key) => {
        setActive(key);
        action('tab')(key);
      }}
    />
  );
}

function MenuCheck() {
  const [segment, setSegment] = useState<'masters' | 'services'>('masters');
  return (
    <View style={styles.menuCheck}>
      <AppBar title="FixIt" onSearchPress={action('search')} />
      <SegmentedControl
        options={[
          { value: 'masters', label: 'Майстри' },
          { value: 'services', label: 'Сервіси' },
        ]}
        value={segment}
        onChange={setSegment}
      />
      <TabBarWithState initial="home" />
    </View>
  );
}

const meta = {
  title: 'Navigation/TabBar',
  component: TabBarWithState,
  args: { initial: 'home' },
  argTypes: {
    initial: { control: { type: 'select' }, options: MAIN_TABS.map((tab) => tab.key) },
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof TabBarWithState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const RequestsActive: Story = { args: { initial: 'requests' } };
export const MenuCheckStory: Story = {
  name: 'Перевірка меню',
  render: () => <MenuCheck />,
};

const styles = StyleSheet.create({
  menuCheck: {
    gap: 16,
  },
});