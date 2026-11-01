import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Text } from './Text';
import { theme } from '../src/theme';

function styleOf(text: string) {
  return StyleSheet.flatten(screen.getByText(text).props.style);
}

describe('Text', () => {
  it('uses body variant and primary color by default', async () => {
    await render(<Text>Привіт</Text>);
    expect(styleOf('Привіт')).toMatchObject({
      ...theme.typography.body,
      color: theme.colors.text.primary,
    });
  });

  it('applies the given variant', async () => {
    await render(<Text variant="h1">Заголовок</Text>);
    expect(styleOf('Заголовок')).toMatchObject(theme.typography.h1);
  });

  it('applies the given color', async () => {
    await render(<Text color="error">Помилка</Text>);
    expect(styleOf('Помилка').color).toBe(theme.colors.text.error);
  });

  it('lets the style prop override theme values', async () => {
    await render(<Text style={{ textAlign: 'center' }}>Центр</Text>);
    expect(styleOf('Центр').textAlign).toBe('center');
  });
});