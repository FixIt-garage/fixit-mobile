import { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react-native';

import RequestsScreen from '../screens/RequestsScreen';
import { NavigationTabBar } from '../navigation/NavigationTabBar';
import { MOCK_ISSUES } from '../src/api/issues';
import { MOCK_CATEGORIES } from '../src/api/categories';
import { setMockMode } from '../src/api/mock';
import { Text } from './Text';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function OtherTabStory() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text variant="h2" color="primary">
        Демонстраційна вкладка
      </Text>
    </View>
  );
}

function RequestDetailsStory() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text variant="h2" color="primary">
        Деталі заявки
      </Text>
    </View>
  );
}

function MainTabsStory() {
  return (
    <Tab.Navigator
      initialRouteName="requests"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavigationTabBar {...props} />}
    >
      <Tab.Screen name="home" component={OtherTabStory} />
      <Tab.Screen name="requests" component={RequestsScreen} />
      <Tab.Screen name="chats" component={OtherTabStory} />
      <Tab.Screen name="profile" component={OtherTabStory} />
    </Tab.Navigator>
  );
}

function RequestsStoryScene({ empty = false }: { empty?: boolean }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          retry: false,
        },
      },
    });

    client.setQueryData(['categories'], MOCK_CATEGORIES);

    client.setQueryData(
      ['issues', 'requests-tab', 'all'],
      {
        pages: [
          {
            items: empty ? [] : MOCK_ISSUES,
            counts: empty
              ? { all: 0, active: 0, done: 0 }
              : { all: 4, active: 3, done: 1 },
          },
        ],
        pageParams: [0],
      },
    );

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="MainTabs"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="MainTabs"
              component={MainTabsStory}
            />
            <Stack.Screen
              name="RequestDetails"
              component={RequestDetailsStory}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

setMockMode(true);

const meta = {
  title: 'Screens/RequestsScreen',
  component: RequestsScreen,
} satisfies Meta<typeof RequestsScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithRequests: Story = {
  render: () => <RequestsStoryScene />,
};

export const Empty: Story = {
  render: () => <RequestsStoryScene empty />,
};
