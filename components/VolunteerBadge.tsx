
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../src/theme';
import { Icon } from './Icon';
import { Text } from './Text';

export function VolunteerBadge() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bg.successSoft,
          borderRadius: theme.radius.pill,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel="Волонтер"
    >
      <Icon
        name="flag"
        size={16}
        color="text/success"
        strokeWidth={1.5}
        testID="volunteer-flag"
      />

      <Text variant="labelMonoBold" color="success">
        ВОЛОНТЕР
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 8,
    gap: 4,
  },
});
