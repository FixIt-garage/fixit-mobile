import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export type InfoRowProps = {
  text: string;
  icon: IconName;
};

export function InfoRow({ text, icon }: InfoRowProps) {
  return (
    <View style={styles.container}>
      <Icon
        name={icon}
        size={20}
        color="text/secondary"
        strokeWidth={1.75}
      />

      <Text variant="body" color="primary">
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
