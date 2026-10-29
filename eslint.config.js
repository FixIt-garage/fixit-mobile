const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['.expo/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/theme/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]+$/]',
          message: 'Не пиши hex-кольори напряму — бери їх з теми: useTheme().colors',
        },
      ],
    },
  },
]);
