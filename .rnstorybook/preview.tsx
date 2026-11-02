import { StyleSheet, View } from 'react-native';
import type { Preview } from '@storybook/react-native';
import { ThemeProvider, theme } from '../src/theme';

// Ширина макетів у Figma
const CANVAS_WIDTH = 360;

const preview: Preview = {
  // Кожна story загортається в тему і показується на полотні шириною 360, як у Figma
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={styles.canvas}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'screen',
      values: [
        { name: 'screen', value: theme.colors.bg.screen },
        { name: 'surface', value: theme.colors.bg.surface },
        { name: 'graphite', value: theme.colors.bg.inverse },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

const styles = StyleSheet.create({
  canvas: {
    width: CANVAS_WIDTH,
    alignSelf: 'center',
    padding: theme.layout.screenPadding,
  },
});

export default preview;