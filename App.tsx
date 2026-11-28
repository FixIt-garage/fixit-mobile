import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { ThemeProvider, useAppFonts } from './src/theme';
import { OfflineGate } from './components/OfflineGate';
import { connectQueryOnlineManager } from './src/network';
import OfflineScreen from './screens/OfflineScreen';

SplashScreen.preventAutoHideAsync();
connectQueryOnlineManager();

function Root() {
  const { state, retryRestore } = useAuth();
  const ready = state.status !== 'loading';
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  // Застосунок відкрили без інтернету: сесію ще не перевірено, тому не показуємо вхід,
  // а екран 22. Після повернення мережі людина потрапляє в свій акаунт без нового входу.
  if (state.status === 'offline') {
    return (
      <OfflineScreen
        retrying={retrying}
        onRetry={() => {
          setRetrying(true);
          void retryRestore().finally(() => setRetrying(false));
        }}
      />
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useAppFonts();

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
           <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <OfflineGate>
              <Root />
            </OfflineGate>
          </AuthProvider>
           </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});