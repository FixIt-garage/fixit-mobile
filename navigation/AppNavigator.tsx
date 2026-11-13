import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import WhoAreYouScreen from '../screens/WhoAreYouScreen';
import {
  ChatsTabScreen,
  HomeTabScreen,
  ProfileTabScreen,
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
};

export type MainTabParamList = Record<MainTabKey, undefined>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WhoAreYou" component={WhoAreYouScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
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
      <Tab.Screen name="profile" component={ProfileTabScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { state } = useAuth();

  if (state.status === 'loading') {
    return null;
  }

  return state.status === 'signedIn' ? <MainTabs /> : <AuthStack />;
}