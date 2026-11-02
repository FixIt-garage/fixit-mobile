import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../src/theme';
import { Text } from './Text';

const HEIGHT = 112;

export type TextAreaProps = Omit<TextInputProps, 'style' | 'multiline'> & {
  label?: string;
  helper?: string;
  error?: string;
  /** Якщо задано — під полем показується лічильник символів */
  maxLength?: number;
  style?: StyleProp<ViewStyle>;
};

export function TextArea({
  label,
  helper,
  error,
  maxLength,
  value,
  defaultValue,
  onChangeText,
  onFocus,
  onBlur,
  style,
  ...rest
}: TextAreaProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [typedLength, setTypedLength] = useState((defaultValue ?? '').length);

  // Якщо поле контрольоване — рахуємо по value, інакше по тому, що надрукували
  const length = value !== undefined ? value.length : typedLength;

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
        style={{
          height: HEIGHT,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.input,
          backgroundColor: theme.colors.bg.surface,
          borderColor,
          borderWidth,
        }}
      >
        <TextInput
          multiline
          textAlignVertical="top"
          accessibilityLabel={label}
          accessibilityHint={message}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          placeholderTextColor={theme.colors.text.secondary}
          onChangeText={(text) => {
            setTypedLength(text.length);
            onChangeText?.(text);
          }}
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
      </View>

      {message || maxLength !== undefined ? (
        <View style={[styles.footer, { gap: theme.spacing.sm }]}>
          <Text variant="caption" color={error ? 'error' : 'secondary'} style={styles.message}>
            {message ?? ''}
          </Text>
          {maxLength !== undefined ? (
            <Text
              variant="caption"
              color="secondary"
              accessibilityLabel={`${length} з ${maxLength} символів`}
            >
              {`${length}/${maxLength}`}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 0,
  },
  footer: {
    flexDirection: 'row',
  },
  message: {
    flex: 1,
  },
});