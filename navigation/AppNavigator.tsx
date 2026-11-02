import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import WhoAreYouScreen from '../screens/WhoAreYouScreen';
import type { Role } from '../src/roles';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Welcome: undefined;
  WhoAreYou: undefined;
  // Обрана на екрані 02 роль: від неї залежить акцентний колір реєстрації
  SignUp: { role: Role };
  Login: undefined;
};

type AppNavigatorProps = {
  hasStoredAccessToken: boolean;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator({
  hasStoredAccessToken,
}: AppNavigatorProps) {
  // Token presence only selects the initial screen; it does not validate authentication
  return (
    <Stack.Navigator
      initialRouteName={hasStoredAccessToken ? 'Home' : 'Welcome'}
    >
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
      {/* Тимчасові заглушки: замінити на реальні екрани, коли вони з'являться */}
      <Stack.Screen
        name="SignUp"
        component={PlaceholderScreen}
        options={{ title: 'Реєстрація' }}
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