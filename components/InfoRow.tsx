import { StyleSheet, View } from 'react-native';
import { useTheme } from '../src/theme';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export type InfoRowProps = {
  text: string;
  icon: IconName;
};

export function InfoRow({ text, icon }: InfoRowProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { gap: theme.spacing.md }]}>
      <Icon name={icon} size={20} color="text/secondary" strokeWidth={1.75} />

      <Text variant="body" color="primary" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flexShrink: 1,
  },
});