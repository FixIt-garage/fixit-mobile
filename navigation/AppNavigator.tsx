import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MasterProfileSetupScreen from '../screens/MasterProfileSetupScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import LoginScreen from '../screens/LoginScreen';
import MasterProfileScreen from '../screens/MasterProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import WhoAreYouScreen from '../screens/WhoAreYouScreen';
import RequestDetailsPlaceholderScreen from '../screens/RequestDetailsPlaceholderScreen';
import {
  ChatsTabScreen,
  HomeTabScreen,
  RequestsTabScreen,
} from '../screens/MainTabScreens';
import { useAuth } from '../src/auth/AuthProvider';
import type { MainTabKey } from '../src/mainTabs';
import type { Role } from '../src/roles';
import { NavigationTabBar } from './NavigationTabBar';

export type RootStackParamList = {
  Welcome: undefined;
  WhoAreYou: undefined;
  SignUp: { role: Role };
  Login: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = Record<MainTabKey, undefined>;

export type MainStackParamList = {
  Tabs: undefined;
  MasterProfile: { masterId: number };
  SearchResults: { city: string; categoryId: number; description: string };
  MasterProfileSetup: undefined;
  RequestDetails: { issueId: number; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WhoAreYou"
        component={WhoAreYouScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavigationTabBar {...props} />}
    >
      <Tab.Screen name="home" component={HomeTabScreen} />
      <Tab.Screen name="requests" component={RequestsTabScreen} />
      <Tab.Screen name="chats" component={ChatsTabScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function SignedInStack() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={MainTabs} />
      <MainStack.Screen name="MasterProfile" component={MasterProfileScreen} />
      <MainStack.Screen name="SearchResults" component={SearchResultsScreen} />
      <MainStack.Screen
        name="MasterProfileSetup"
        component={MasterProfileSetupScreen}
      />
      <MainStack.Screen
        name="RequestDetails"
        component={RequestDetailsPlaceholderScreen}
      />
    </MainStack.Navigator>
  );
}

export default function AppNavigator() {
  const { state } = useAuth();

  // `offline`: сесію ще не перевірено (App показує екран 22), тож не відкриваємо вхід
  if (state.status === 'loading' || state.status === 'offline') {
    return null;
  }

  if (state.status === 'signedIn') {
    return <SignedInStack />;
  }

  return <AuthStack />;
}
