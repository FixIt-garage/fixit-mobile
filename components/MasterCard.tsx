import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { GradientName } from '../src/theme';
import { formatRating, formatReviews } from '../src/format';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { NutRating } from './NutRating';
import { Text } from './Text';
import { VolunteerBadge } from './VolunteerBadge';

export type MasterCardProps = {
    name: string;
    specialization: string;
    rating: number;
    reviewsCount: number;
    volunteer?: boolean;
    avatarUri?: string;
    avatarGradient?: GradientName;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
};

export function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

export function MasterCard({
    name,
    specialization,
    rating,
    reviewsCount,
    volunteer = false,
    avatarUri,
    avatarGradient = 'client',
    onPress,
    style,
}: MasterCardProps) {
    const reviews = formatReviews(reviewsCount);

    return (
        <Card
            onPress={onPress}
            accessibilityLabel={[
                name,
                volunteer ? 'волонтер' : null,
                specialization,
                `рейтинг ${formatRating(rating)}`,
                reviews,
            ]
                .filter(Boolean)
                .join(', ')}
            style={[styles.row, style]}
        >
            <Avatar initials={getInitials(name)} uri={avatarUri} gradient={avatarGradient} size={56} />

            <View style={styles.info}>
                {volunteer ? <VolunteerBadge /> : null}
                <Text variant="bodyBold" numberOfLines={1}>
                    {name}
                </Text>
                <Text variant="bodySmall" color="secondary" numberOfLines={1}>
                    {specialization}
                </Text>
                <Text variant="labelMono">{`· ${reviews}`}</Text>
            </View>

            <NutRating mode="display" rating={rating} size={44} />
        </Card>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    info: {
        flex: 1,
        gap: 4,
    },
});