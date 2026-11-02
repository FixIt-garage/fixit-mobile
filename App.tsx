import { useEffect, useState  } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider, useAppFonts } from './src/theme';
import {hasStoredAccessToken} from './src/auth/session';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useAppFonts();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const hasToken = await hasStoredAccessToken();
        setHasActiveSession(hasToken);
      } catch (error) {
        console.error('Session check failed:', error);
        setHasActiveSession(false);
      } finally {
        setSessionChecked(true);
      }
    }

    checkSession();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && sessionChecked) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, sessionChecked]);

    if ((!fontsLoaded && !fontError) || !sessionChecked){
     return null;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator  hasActiveSession={hasActiveSession} />
      </NavigationContainer>
    </ThemeProvider>
  );
}