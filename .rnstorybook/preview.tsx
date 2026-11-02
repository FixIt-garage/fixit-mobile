import { StyleSheet, View } from 'react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import type { Preview } from '@storybook/react-native';
import { ThemeProvider, theme } from '../src/theme';

// Ширина макетів у Figma
const CANVAS_WIDTH = 360;

const preview: Preview = {
  decorators: [
    // Кожна story загортається в тему і показується на полотні шириною 360, як у Figma
    (Story) => (
      <ThemeProvider>
        <View style={styles.canvas}>
          <Story />
        </View>
      </ThemeProvider>
    ),
    // Застосовує фон, вибраний у вкладці Backgrounds
    withBackgrounds,
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
    // Займає всю висоту, щоб довгі stories з ScrollView могли прокручуватись
    flex: 1,
    // 360 як у Figma, але не ширше за екран (iPhone SE — 320)
    width: '100%',
    maxWidth: CANVAS_WIDTH,
    alignSelf: 'center',
    padding: theme.layout.screenPadding,
  },
});

export default preview;