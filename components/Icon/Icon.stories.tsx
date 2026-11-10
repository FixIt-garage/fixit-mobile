import { ScrollView, StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useTheme } from '../../src/theme';
import { Text } from '../Text';
import { Icon, iconNames } from './Icon';

const COLUMNS = 4;
const softWrap = (name: string) => name.replace(/-/g, '-\u200B');

function IconGrid() {
  const theme = useTheme();

  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: theme.colors.bg.surface,
          borderRadius: theme.radius.card,
          padding: theme.layout.cardPadding,
          gap: theme.spacing.lg,
        }}
      >
        <Text variant="bodyBold">Іконки — набір Lucide (lucide-react-native)</Text>
        <View style={styles.grid}>
          {iconNames.map((name) => (
            <View
              key={name}
              style={[
                styles.cell,
                { gap: theme.spacing.sm, paddingVertical: theme.spacing.sm },
              ]}
            >
              <Icon name={name} />
              <Text variant="caption" color="secondary" style={styles.label}>
                {softWrap(name)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const meta = {
  title: 'Icons/All',
  component: Icon,
  args: {
    name: 'search',
    size: 24,
    color: 'text/primary',
  },
  argTypes: {
    name: { control: { type: 'select' }, options: iconNames },
    size: { control: { type: 'number' } },
    color: {
      control: { type: 'select' },
      options: [
        'icon/default',
        'text/primary',
        'text/secondary',
        'text/disabled',
        'text/brand',
        'text/onBrand',
        'text/onInverse',
        'text/success',
        'text/error',
      ],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => <IconGrid />,
};

export const Playground: Story = {};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / COLUMNS}%`,
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
