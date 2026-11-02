import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Welcome: undefined;
  WhoAreYou: undefined;
  Login: undefined;
};

type AppNavigatorProps = {
  hasActiveSession: boolean;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator({
  hasActiveSession,
  }: AppNavigatorProps) {
  return (
    <Stack.Navigator initialRouteName={hasActiveSession ? 'Home' : 'Welcome'}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      {/* Тимчасові заглушки: замінити на реальні екрани, коли вони з'являться */}
      <Stack.Screen
        name="WhoAreYou"
        component={PlaceholderScreen}
        options={{ title: 'Хто ви' }}
      />
      <Stack.Screen
        name="Login"
        component={PlaceholderScreen}
        options={{ title: 'Вхід' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Головна' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Профіль' }}
      />
    </Stack.Navigator>
  );
}
