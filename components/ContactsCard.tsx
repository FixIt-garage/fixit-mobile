import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Card } from './Card';
import { InfoRow } from './InfoRow';
import { Text } from './Text';

export type ContactsCardProps = {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  style?: StyleProp<ViewStyle>;
};

export function ContactsCard({ phone, email, address, style }: ContactsCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <Text variant="labelMono" color="secondary">
        Контакти
      </Text>
      {phone ? <InfoRow icon="phone" text={phone} /> : null}
      {email ? <InfoRow icon="mail" text={email} /> : null}
      {address ? <InfoRow icon="map-pin" text={address} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
});