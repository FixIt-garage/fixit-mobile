
import { useTheme } from '../../src/theme';
import { Image } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

export type LogoVariant =
  | 'mark'
  | 'mark-mono'
  | 'app-icon'
  | 'wordmark'
  | 'lockup';

export type LogoProps = {
  variant?: LogoVariant;
  size?: number;
  color?: string;
  backgroundColor?: string;
};

type LogoColors = {
  brand: string;
  brandPressed: string;
  text: string;
  white: string;
  background: string;
};

function Mark({
  size,
  mono = false,
  color,
  backgroundColor,
  logoColors,
}: {
  size: number;
  mono?: boolean;
  color?: string;
  backgroundColor?: string;
  logoColors: LogoColors;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96">
      {!mono && (
        <Defs>
          <LinearGradient
            id="markGradient"
            x1="13.7143"
            y1="13.7143"
            x2="82.2857"
            y2="82.2857"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={logoColors.brand} />
            <Stop offset="1" stopColor={logoColors.brandPressed} />
          </LinearGradient>
        </Defs>
      )}

      <Path
        d="M42.24 3.32554C45.8043 1.2677 50.1957 1.2677 53.76 3.32554L83.8092 20.6745C87.3735 22.7323 89.5692 26.5354 89.5692 30.6511V65.3489C89.5692 69.4646 87.3735 73.2677 83.8092 75.3255L53.76 92.6745C50.1957 94.7323 45.8043 94.7323 42.24 92.6745L12.1908 75.3255C8.62648 73.2677 6.43078 69.4646 6.43078 65.3489V30.6511C6.43078 26.5354 8.62648 22.7323 12.1908 20.6745L42.24 3.32554Z"
        fill={mono ? (color ?? logoColors.text) : 'url(#markGradient)'}
      />

      <Circle
        cx="48"
        cy="48"
        r="18.24"
        fill={mono ? (backgroundColor ?? logoColors.background) : logoColors.white}
      />
    </Svg>
  );
}

function Wordmark({
  size,
  color,
  logoColors,
}: {
  size: number;
  color?: string;
  logoColors: LogoColors;
}) {
  return (
    <Svg
      width={size * (199 / 60)}
      height={size}
      viewBox="0 0 199 60"
    >
      <Path
        d="M10.416 25.408H41.104V37.448H10.416V25.408ZM42.224 9V21.04H11.2L17.808 14.6V51H3.36V9H42.224ZM45.9769 9H60.4249V51H45.9769V9ZM93.2369 33.64V24.736L114.517 51H96.7649L84.2209 34.368H91.5009L78.8449 51H61.3169L82.7649 24.736V33.64L62.3809 9H80.4689L91.7809 23.952H84.5009L95.5889 9H113.453L93.2369 33.64ZM115.406 9H129.854V51H115.406V9ZM147.826 15.216H162.274V51H147.826V15.216ZM132.706 9H177.394V21.88H132.706V9Z"
        fill={color ?? logoColors.text}
      />

      <Circle
        cx="191"
        cy="41"
        r="7"
        fill={logoColors.brand}
      />
    </Svg>
  );
}

function Lockup({
  size,
  color,
  logoColors,
}: {
  size: number;
  color?: string;
  logoColors: LogoColors;
}) {
  return (
    <Svg
      width={size * (196 / 56)}
      height={size}
      viewBox="0 0 196 56"
    >
      <Defs>
        <LinearGradient
          id="lockupGradient"
          x1="8"
          y1="8"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor={logoColors.brand} />
          <Stop offset="1" stopColor={logoColors.brandPressed} />
        </LinearGradient>
      </Defs>

      <Path
        d="M22.24 3.32554C25.8043 1.26769 30.1957 1.26769 33.76 3.32554L46.4887 10.6745C50.053 12.7323 52.2487 16.5354 52.2487 20.6511V35.3489C52.2487 39.4646 50.053 43.2677 46.4887 45.3255L33.76 52.6745C30.1957 54.7323 25.8043 54.7323 22.24 52.6745L9.51129 45.3255C5.94699 43.2677 3.75129 39.4646 3.75129 35.3489V20.6511C3.75129 16.5354 5.94699 12.7323 9.51129 10.6745L22.24 3.32554Z"
        fill="url(#lockupGradient)"
      />

      <Circle
        cx="28"
        cy="28"
        r="10.64"
        fill={logoColors.white}
      />

      <Path
        d="M78.4579 25.133H97.4845V32.5978H78.4579V25.133ZM98.1789 14.96V22.4248H78.944L83.041 18.432V41H74.0832V14.96H98.1789ZM100.506 14.96H109.463V41H100.506V14.96ZM129.807 30.2368V24.7163L143.001 41H131.994L124.217 30.6882H128.731L120.884 41H110.017L123.314 24.7163V30.2368L110.676 14.96H121.891L128.904 24.2302H124.391L131.265 14.96H142.341L129.807 30.2368ZM143.552 14.96H152.509V41H143.552V14.96ZM163.652 18.8139H172.61V41H163.652V18.8139ZM154.278 14.96H181.984V22.9456H154.278V14.96Z"
        fill={color ?? logoColors.text}
      />

      <Circle
        cx="190.44"
        cy="35.22"
        r="4.34"
        fill={logoColors.brand}
      />
    </Svg>
  );
}

export function Logo({
  variant = 'mark',
  size = 96,
  color,
  backgroundColor,
}: LogoProps) {
  const { colors } = useTheme();

  const logoColors: LogoColors = {
    brand: colors.bg.brand,
    brandPressed: colors.bg.brandPressed,
    text: colors.text.primary,
    white: colors.text.onBrand,
    background: colors.bg.surface,
  };

  switch (variant) {
    case 'mark':
      return (
        <Mark
          size={size}
          logoColors={logoColors}
        />
      );

    case 'mark-mono':
      return (
        <Mark
          size={size}
          mono
          color={color ?? logoColors.text}
          backgroundColor={backgroundColor ?? logoColors.background}
          logoColors={logoColors}
        />
      );

    case 'app-icon':
      return (
        <Image
          source={require('../../assets/app-icon.png')}
          style={{ width: size, height: size }}
          resizeMode="contain"
          accessibilityLabel="FixIt app icon"
        />
      );

    case 'wordmark':
      return (
        <Wordmark
          size={size}
          color={color}
          logoColors={logoColors}
        />
      );

    case 'lockup':
      return (
        <Lockup
          size={size}
          color={color}
          logoColors={logoColors}
        />
      );

    default:
      return null;
  }
}
