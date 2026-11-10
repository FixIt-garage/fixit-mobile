import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme';
import { Icon, type IconName } from './Icon/Icon';
import { Text } from './Text';

const HEIGHT = 48;

export type TabItemProps = {
  icon: IconName;
  label: string;
  active: boolean;
  onPress: () => void;
};

export function TabItem({ icon, label, active, onPress }: TabItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[
        styles.base,
        {
          height: HEIGHT,
          paddingHorizontal: theme.spacing.lg,
          gap: theme.spacing.sm,
          borderRadius: theme.radius.pill,
        },
        active && { backgroundColor: theme.colors.bg.brand },
      ]}
    >
      <Icon name={icon} color={active ? 'text/onInverse' : 'text/onInverseMuted'} />
      {active ? (
        <Text
          variant="bodySmall"
          color="onInverse"
          style={{ fontFamily: theme.fonts.onestSemiBold }}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});