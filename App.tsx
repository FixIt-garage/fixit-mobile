import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider, useAppFonts } from './src/theme';
import { hasStoredAccessToken } from './src/auth/session';

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

  if ((!fontsLoaded && !fontError) || !tokenCheckCompleted) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator hasStoredAccessToken={accessTokenStored} />
      </NavigationContainer>
    </ThemeProvider>
  );
}
