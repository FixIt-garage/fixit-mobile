import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, type GradientName } from '../src/theme';
import { Text } from './Text';

export type AvatarProps = {
  initials: string;
  gradient: GradientName;
  uri?: string;
  size?: number;
  radius?: number;
};

export function Avatar({
  initials,
  gradient,
  uri,
  size = 72,
  radius = 16,
}: AvatarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={initials}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <>
          <LinearGradient
            colors={theme.gradients[gradient]}
            start={theme.gradientDirection.start}
            end={theme.gradientDirection.end}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.initials}>
            <Text variant="h2" color="onBrand">
              {initials}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});