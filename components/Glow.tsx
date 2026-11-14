import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export type GlowProps = {
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function Glow({ color, size = 420, style }: GlowProps) {
  const id = `glow-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  const radius = size / 2;

  return (
    <Svg width={size} height={size} style={style} pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={color} stopOpacity={0.5} />
          <Stop offset="0.45" stopColor={color} stopOpacity={0.4} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={radius} cy={radius} r={radius} fill={`url(#${id})`} />
    </Svg>
  );
}