import { useEffect, useState, type ComponentType } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider, useAppFonts } from './src/theme';
import { hasStoredAccessToken } from './src/auth/session';

// Storybook підвантажується лише з прапорцем; у звичайній збірці цей require вирізається.
const StorybookUIRoot: ComponentType | null =
  process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true'
    ? require('./.rnstorybook').default
    : null;

// Тримаємо splash screen, поки не завантажаться шрифти і не перевіриться токен.
// Викликається один раз, ще до першого рендеру.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useAppFonts();
  const [tokenCheckCompleted, setTokenCheckCompleted] = useState(false);
  const [accessTokenStored, setAccessTokenStored] = useState(false);

  useEffect(() => {
    async function checkStoredToken() {
      try {
        const hasToken = await hasStoredAccessToken();
        setAccessTokenStored(hasToken);
      } catch (error) {
        console.error('Stored token lookup failed:', error);
        setAccessTokenStored(false);
      } finally {
        setTokenCheckCompleted(true);
      }
    }

    checkStoredToken();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && tokenCheckCompleted) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, tokenCheckCompleted]);

  // Поки вантажаться шрифти або перевіряється токен — користувач бачить splash.
  if ((!fontsLoaded && !fontError) || !tokenCheckCompleted) {
    return null;
  }

  // Режим Storybook: замість застосунку показуємо каталог компонентів (шрифти вже завантажені)
  if (StorybookUIRoot) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <StorybookUIRoot />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator hasStoredAccessToken={accessTokenStored} />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});