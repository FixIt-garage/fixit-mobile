
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Path,
  Pattern,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ApiError } from '../api/client';
import { Icon } from '../components/Icon/Icon';
import { Input } from '../components/Input';
import { SlideButton } from '../components/SlideButton';
import { Text } from '../components/Text';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../src/auth/AuthProvider';
import { useTheme } from '../src/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const HEADER_HEIGHT = 220;
const SHEET_OVERLAP = 32;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function HeaderBackground({
  brandColor,
  gridColor,
}: {
  brandColor: string;
  gridColor: string;
}) {
  return (
    <Svg
      width="100%"
      height="100%"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <Pattern
          id="login-grid"
          width={24}
          height={24}
          patternUnits="userSpaceOnUse"
        >
          <Path
            d="M24 0H0V24"
            fill="none"
            stroke={gridColor}
            strokeWidth={1}
          />
        </Pattern>

        <RadialGradient
          id="login-glow"
          cx="80%"
          cy="10%"
          r="70%"
        >
          <Stop
            offset="0"
            stopColor={brandColor}
            stopOpacity={0.4}
          />
          <Stop
            offset="1"
            stopColor={brandColor}
            stopOpacity={0}
          />
        </RadialGradient>
      </Defs>

      <Rect
        width="100%"
        height="100%"
        fill="url(#login-glow)"
      />

      <Rect
        width="100%"
        height="100%"
        fill="url(#login-grid)"
      />
    </Svg>
  );
}

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slideKey, setSlideKey] = useState(0);

  const resetSlide = () => {
    setSlideKey((current) => current + 1);
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setEmailError('Введіть коректну електронну пошту');
      resetSlide();
      return;
    }

    if (!password) {
      setLoginError('Введіть пароль');
      resetSlide();
      return;
    }

    setEmailError('');
    setLoginError('');
    setIsSubmitting(true);

    try {
      await signIn(normalizedEmail, password);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setLoginError('Неправильна електронна пошта або пароль');
      } else {
        setLoginError(
          'Не вдалося увійти. Перевірте підключення та спробуйте ще раз',
        );
      }

      resetSlide();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Відновлення пароля',
      'Функція відновлення пароля буде доступна пізніше.',
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.bg.inverse },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            height: HEADER_HEIGHT + insets.top,
            backgroundColor: theme.colors.bg.inverse,
          },
        ]}
      >
        <HeaderBackground
          brandColor={theme.colors.bg.brand}
          gridColor={theme.colors.glass.grid}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            { top: insets.top + 24 },
          ]}
        >
          <Icon
            name="chevron-left"
            size={20}
            color="text/onInverse"
          />
        </Pressable>

        <View
          style={[
            styles.headerTitles,
            { top: insets.top + 100 },
          ]}
        >
          <Text
            variant="labelMono"
            style={{ color: theme.colors.text.onInverseMuted }}
          >
            Акаунт FixIt
          </Text>

          <Text
            variant="h1"
            accessibilityRole="header"
            style={{ color: theme.colors.text.onInverse }}
          >
            З поверненням!
          </Text>
        </View>
      </View>

      {/* White form sheet */}
      <KeyboardAvoidingView
        style={[
          styles.sheet,
          { backgroundColor: theme.colors.bg.surface },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          <Input
            label="Пошта"
            placeholder="name@gmail.com"
            style={{ gap: theme.spacing.sm }}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setEmailError('');
              setLoginError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={emailError}
          />

          <Input
            label="Пароль"
            placeholder="Ваш пароль"
            style={{ gap: theme.spacing.sm }}
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setLoginError('');
            }}
            password
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
          />

          <Pressable
            accessibilityRole="link"
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
          >
            <Text
              variant="bodyBold"
              style={{ color: theme.colors.text.brand }}
            >
              Забули пароль?
            </Text>
          </Pressable>

          {!!loginError && (
            <Text
              color="error"
              accessibilityRole="alert"
            >
              {loginError}
            </Text>
          )}

          <View style={styles.spacer} />

          <SlideButton
            key={slideKey}
            label={isSubmitting ? 'Входимо...' : 'Увійти'}
            onConfirm={handleLogin}
            disabled={isSubmitting}
            gradient="client"
          />

          <View style={styles.registerRow}>
            <Text color="secondary">
              Немає акаунта?
            </Text>

            <Pressable
              accessibilityRole="link"
              hitSlop={8}
              onPress={() => navigation.navigate('WhoAreYou')}
            >
              <Text
                variant="bodyBold"
                style={{ color: theme.colors.text.brand }}
              >
                Зареєструватися
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    position: 'absolute',
    left: 22,
    gap: 6,
  },
  sheet: {
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  sheetContent: {
    flexGrow: 1,
    gap: 12,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
  },
  spacer: {
    flexGrow: 1,
    minHeight: 24,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});
