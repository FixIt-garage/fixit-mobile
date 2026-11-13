import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../src/theme';
import { BlueprintGrid } from './BlueprintGrid';
import { Icon } from './Icon';
import { Text } from './Text';

const CONTENT_HEIGHT = 196;
const GLOW_SIZE = 420;

export type HeroHeaderProps = {
    title: string;
    kicker?: string;
    onBack?: () => void;
    overlap?: number;
};

export function HeroHeader({ title, kicker, onBack, overlap = 0 }: HeroHeaderProps) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const height = insets.top + CONTENT_HEIGHT;

    return (
        <View
            style={[
                styles.hero,
                {
                    height,
                    backgroundColor: theme.colors.bg.inverse,
                    paddingTop: insets.top + theme.spacing.md,
                    paddingHorizontal: theme.layout.screenPadding,
                    paddingBottom: overlap + theme.spacing.lg,
                },
            ]}
        >
            <StatusBar style="light" />

            <Svg
                width={GLOW_SIZE}
                height={GLOW_SIZE}
                style={[styles.glow, { left: width - 270 }]}
                pointerEvents="none"
            >
                <Defs>
                    <RadialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
                        <Stop offset="0" stopColor={theme.colors.bg.brand} stopOpacity={0.5} />
                        <Stop offset="0.45" stopColor={theme.colors.bg.brand} stopOpacity={0.4} />
                        <Stop offset="1" stopColor={theme.colors.bg.brand} stopOpacity={0} />
                    </RadialGradient>
                </Defs>
                <Circle cx={GLOW_SIZE / 2} cy={GLOW_SIZE / 2} r={GLOW_SIZE / 2} fill="url(#hero-glow)" />
            </Svg>

            <BlueprintGrid width={width} height={height} offset={8} color={theme.colors.glass.grid} />

            {onBack ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Назад"
                    onPress={onBack}
                    hitSlop={8}
                    style={[styles.back, { backgroundColor: theme.colors.glass.grid }]}
                >
                    <Icon name="chevron-left" size={20} color="text/onInverse" />
                </Pressable>
            ) : (
                <View />
            )}

            <View style={{ gap: theme.spacing.xs }}>
                {kicker ? (
                    <Text variant="labelMono" color="onInverseMuted">
                        {kicker}
                    </Text>
                ) : null}
                <Text variant="h1" color="onInverse" accessibilityRole="header">
                    {title}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hero: {
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    glow: {
        position: 'absolute',
        top: -200,
    },
    back: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});