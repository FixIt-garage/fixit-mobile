import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme, type Theme, type TypographyVariant } from '../src/theme';

type TextColor = keyof Theme['colors']['text'];

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: TextColor;
};

export function Text({ variant = 'body', color = 'primary', style, ...rest }: TextProps) {
  const theme = useTheme();

  return (
    <RNText
      style={[theme.typography[variant], { color: theme.colors.text[color] }, style]}
      {...rest}
    />
  );
}