import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Glow } from './Glow';
import { useTheme } from '../src/theme';
import { BlueprintGrid } from './BlueprintGrid';
import { Icon } from './Icon';
import { Text } from './Text';

const CONTENT_HEIGHT = 196;


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

                  <Glow color={theme.colors.bg.brand} style={[styles.glow, { left: width - 270 }]} />

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