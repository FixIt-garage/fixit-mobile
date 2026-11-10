import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';
import { Icon } from './Icon/Icon';

const HEIGHT = 52;

export type InputProps = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label?: string;
  helper?: string;
  error?: string;
  password?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Input({
  label,
  helper,
  error,
  password = false,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error
    ? theme.colors.border.error
    : focused
      ? theme.colors.border.focus
      : theme.colors.border.default;
  const borderWidth = error || focused ? 2 : 1;
  const message = error ?? helper;

  return (
    <View style={[{ gap: theme.spacing.xs }, style]}>
      {label ? <Text variant="bodySmall">{label}</Text> : null}

      <View
        style={[
          styles.field,
          {
            height: HEIGHT,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.radius.input,
            backgroundColor: theme.colors.bg.surface,
            borderColor,
            borderWidth,
            gap: theme.spacing.sm,
          },
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={message}
          placeholderTextColor={theme.colors.text.secondary}
          secureTextEntry={password && hidden}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            styles.input,
            {
              fontFamily: theme.typography.body.fontFamily,
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.primary,
            },
          ]}
          {...rest}
        />

        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Показати пароль' : 'Сховати пароль'}
            onPress={() => setHidden((value) => !value)}
            hitSlop={12}
          >
            <Icon
              name={hidden ? 'eye-off' : 'eye'}
              size={20}
              color="text/secondary"
              testID={hidden ? 'password-icon-eye-off' : 'password-icon-eye'}
            />
          </Pressable>
        ) : null}
      </View>

      {message ? (
        <Text variant="caption" color={error ? 'error' : 'secondary'}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
  },
});