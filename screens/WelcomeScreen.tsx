import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '../components/Logo';
import { Text } from '../components/Text';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../src/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const ORBIT_WIDTH_RATIO = 300 / 360;
const INNER_RING_RATIO = 224 / 300;
const ICON_RATIO = 128 / 300;

const ICON_FILE_SCALE = 487 / 384;

const ICON_FILE_SHIFT = 5.69 / 128;

const RING_OPACITY = 0.12;

const DASH_COUNT = 94;
const DASH_FILL = 0.4;

const GAP_ORBIT_TO_HEADLINE = 74;
const GAP_SUBTITLE_TO_BUTTON = 60;
const LOGIN_ROW_HEIGHT = 44;
const BOTTOM_GAP = 28;

const DOTS = [
  { ring: 'outer', angle: 215, size: 5 },
  { ring: 'outer', angle: 325, size: 8 },
  { ring: 'inner', angle: 140, size: 6 },
] as const;

export default function WelcomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [orbitAreaHeight, setOrbitAreaHeight] = useState(0);

  const handleOrbitAreaLayout = (event: LayoutChangeEvent) => {
    setOrbitAreaHeight(event.nativeEvent.layout.height);
  };

  const orbitSize = Math.max(
    0,
    Math.min(width * ORBIT_WIDTH_RATIO, orbitAreaHeight),
  );
  const innerSize = orbitSize * INNER_RING_RATIO;
  const iconSize = orbitSize * ICON_RATIO;
  const iconFileSize = iconSize * ICON_FILE_SCALE;

  // Штрихи лежать на колі радіусом dashRadius (лінія 1 px всередині кола).
  const dashRadius = orbitSize / 2 - 0.5;
  const dashLength = ((2 * Math.PI * dashRadius) / DASH_COUNT) * DASH_FILL;

  const brandColor = theme.colors.bg.brand;
  const ringColor = theme.colors.text.primary;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.bg.screen }]}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + theme.spacing.xl,
            paddingBottom: Math.max(insets.bottom, BOTTOM_GAP),
            paddingHorizontal: theme.layout.screenPadding,
          },
        ]}
      >
        <Logo variant="wordmark" size={24} />

        {/* Illustration */}
        <View
          style={[
            styles.orbitArea,
            {
              marginTop: theme.spacing.lg,
              marginBottom: GAP_ORBIT_TO_HEADLINE,
            },
          ]}
          onLayout={handleOrbitAreaLayout}
        >
          {orbitSize > 0 && (
            <View style={{ width: orbitSize, height: orbitSize }}>
              {/* Outer dashed ring: штрихи по колу, спільна прозорість 12 % */}
              <View
                style={[
                  styles.layer,
                  { width: orbitSize, height: orbitSize, opacity: RING_OPACITY },
                ]}
              >
                {Array.from({ length: DASH_COUNT }, (_, index) => {
                  const angle = (index * 360) / DASH_COUNT;
                  const radians = (angle * Math.PI) / 180;
                  return (
                    <View
                      key={`dash-${index}`}
                      style={{
                        position: 'absolute',
                        width: dashLength,
                        height: 1,
                        backgroundColor: ringColor,
                        left:
                          orbitSize / 2 +
                          dashRadius * Math.cos(radians) -
                          dashLength / 2,
                        top:
                          orbitSize / 2 + dashRadius * Math.sin(radians) - 0.5,
                        // Штрих повернутий вздовж дотичної до кола.
                        transform: [{ rotate: `${angle + 90}deg` }],
                      }}
                    />
                  );
                })}
              </View>

              {/* Inner solid ring */}
              <View
                style={{
                  position: 'absolute',
                  width: innerSize,
                  height: innerSize,
                  borderRadius: innerSize / 2,
                  left: (orbitSize - innerSize) / 2,
                  top: (orbitSize - innerSize) / 2,
                  borderWidth: 1,
                  borderColor: ringColor,
                  opacity: RING_OPACITY,
                }}
              />

              {/* App icon (файл містить тінь по краях) */}
              <Image
                source={require('../assets/fixit-app-icon.png')}
                resizeMode="contain"
                style={{
                  position: 'absolute',
                  width: iconFileSize,
                  height: iconFileSize,
                  left: (orbitSize - iconFileSize) / 2,
                  top:
                    (orbitSize - iconFileSize) / 2 +
                    iconSize * ICON_FILE_SHIFT,
                }}
              />

              {/* Dots on the rings */}
              {DOTS.map(({ ring, angle, size }) => {
                const radius = (ring === 'outer' ? orbitSize : innerSize) / 2;
                const radians = (angle * Math.PI) / 180;
                return (
                  <View
                    key={`${ring}-${angle}`}
                    style={{
                      position: 'absolute',
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      backgroundColor: brandColor,
                      left: orbitSize / 2 + radius * Math.cos(radians) - size / 2,
                      top: orbitSize / 2 + radius * Math.sin(radians) - size / 2,
                    }}
                  />
                );
              })}
            </View>
          )}
        </View>

        {/* Headline */}
        <Text variant="display">
          Зламалося?{'\n'}
          <Text variant="display" style={{ color: brandColor }}>
            Полагодимо.
          </Text>
        </Text>

        <Text color="secondary" style={{ marginTop: theme.spacing.lg }}>
          Майстри, сервіси й волонтери вашого міста — в одному місці.
        </Text>

        {/* Primary button */}
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('WhoAreYou')}
          style={({ pressed }) => [
            {
              marginTop: GAP_SUBTITLE_TO_BUTTON,
              borderRadius: theme.layout.buttonHeight / 2,
              overflow: 'hidden',
            },
            pressed && styles.pressed,
          ]}
        >
          <LinearGradient
            colors={theme.gradients.client}
            start={theme.gradientDirection.start}
            end={theme.gradientDirection.end}
            style={[styles.button, { height: theme.layout.buttonHeight }]}
          >
            <Text variant="button" color="onInverse">
              Почати
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Login link */}
        <View style={[styles.loginRow, { marginTop: theme.spacing.md }]}>
          <Text color="secondary">Вже маєте акаунт?</Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text variant="bodyBold" style={{ color: brandColor }}>
              Увійти
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  orbitArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  loginRow: {
    height: LOGIN_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});