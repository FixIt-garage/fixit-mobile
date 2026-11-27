import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useController, useForm, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../src/theme';
import { useAuth } from '../src/auth/AuthProvider';
import {
  conflictField,
  formatPhone,
  invalidFields,
  phoneDigits,
  signUpSchema,
  toApiPhone,
  type SignUpValues,
} from '../src/auth/signUpForm';
import { BottomSheet, BOTTOM_SHEET_RADIUS } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { HeroHeader } from '../components/HeroHeader';
import { Input, type InputProps } from '../components/Input';
import { Text } from '../components/Text';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
type Role = RootStackParamList['SignUp']['role'];

const ACCOUNT_NAMES: Record<Role, string> = {
  client: 'клієнта',
  master: 'майстра',
  center: 'сервісного центру',
  org: 'організації',
};

type FormInputProps = Omit<InputProps, 'value' | 'onChangeText' | 'onBlur' | 'error'> & {
  control: Control<SignUpValues>;
  name: keyof SignUpValues;
  format?: (value: string) => string;
  parse?: (text: string) => string;
};

function FormInput({ control, name, format, parse, ...props }: FormInputProps) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Input
      {...props}
      value={format ? format(field.value) : field.value}
      onChangeText={(text) => field.onChange(parse ? parse(text) : text)}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}

export default function SignUpScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const theme = useTheme();
  const { signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await signUp({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: toApiPhone(values.phone),
        email: values.email.trim(),
        address: values.address.trim(),
        password: values.password,
        role,
      });
    } catch (error) {
      const field = conflictField(error);
      if (field === 'email') {
        setError('email', { message: 'Ця пошта вже зареєстрована' });
        return;
      }
      if (field === 'phone') {
        setError('phone', { message: 'Цей номер уже зареєстрований' });
        return;
      }
      const invalid = invalidFields(error);
      if (invalid) {
        invalid.forEach((name) => setError(name, { message: 'Перевірте це поле' }));
        setFormError('Перевірте дані у формі.');
        return;
      }
      setFormError('Не вдалося зареєструватися. Перевірте інтернет і спробуйте ще раз.');
    }
  });

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.bg.inverse }]}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <HeroHeader
            kicker={`Крок 2 / 2 · акаунт ${ACCOUNT_NAMES[role]}`}
            title="Створімо акаунт"
            onBack={() => navigation.goBack()}
            overlap={BOTTOM_SHEET_RADIUS}
          />

          <BottomSheet style={styles.sheet}>
            <View style={[styles.form, { paddingTop: theme.spacing.md, gap: theme.spacing.md }]}>
              <View style={styles.nameRow}>
                <FormInput
                  control={control}
                  name="firstName"
                  label="Імʼя"
                  placeholder="Олександр"
                  autoComplete="given-name"
                  textContentType="givenName"
                  style={styles.nameField}
                />
                <FormInput
                  control={control}
                  name="lastName"
                  label="Прізвище"
                  placeholder="Коваль"
                  autoComplete="family-name"
                  textContentType="familyName"
                  style={styles.nameField}
                />
              </View>

              <FormInput
                control={control}
                name="phone"
                label="Телефон"
                placeholder="+380 __ ___ __ __"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                format={formatPhone}
                parse={phoneDigits}
              />

              <FormInput
                control={control}
                name="email"
                label="Пошта"
                placeholder="name@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
              />

              <FormInput
                control={control}
                name="address"
                label="Адреса"
                placeholder="Місто, вулиця, будинок"
                textContentType="fullStreetAddress"
              />

              <FormInput
                control={control}
                name="password"
                label="Пароль"
                placeholder="Щонайменше 8 символів"
                password
                autoCapitalize="none"
                textContentType="newPassword"
              />

              <View style={styles.spacer} />

              {formError ? (
                <Text variant="bodySmall" color="error" accessibilityRole="alert">
                  {formError}
                </Text>
              ) : null}

              <Button
                label={isSubmitting ? 'Зачекайте…' : 'Зареєструватися'}
                gradient={role}
                onPress={() => {
                  if (!isSubmitting) {
                    void onSubmit();
                  }
                }}
              />
            </View>
          </BottomSheet>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  sheet: {
    flex: 1,
    marginTop: -BOTTOM_SHEET_RADIUS,
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 10,
  },
  nameField: {
    flex: 1,
  },
  spacer: {
    flex: 1,
    minHeight: 12,
  },
});