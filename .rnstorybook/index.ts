import { createElement } from 'react';
import { StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppFonts } from '../src/theme';
import { view } from './storybook.requires';

// Точка входу в режимі Storybook: withStorybook у metro.config.js
// підставляє цей файл замість застосунку, коли EXPO_PUBLIC_STORYBOOK_ENABLED=true.
const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

// Спершу вантажимо шрифти теми, щоб stories виглядали як у застосунку
function StorybookApp() {
  const [fontsLoaded, fontError] = useAppFonts();

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return createElement(GestureHandlerRootView, { style: styles.root }, createElement(StorybookUIRoot));
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

registerRootComponent(StorybookApp);