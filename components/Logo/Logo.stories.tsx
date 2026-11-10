
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { Logo } from './Logo';
import type { LogoVariant } from './Logo';
import { useTheme } from '../../src/theme';

const meta: Meta<typeof Logo> = {
  title: 'Icons/Logo',
  component: Logo,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Logo>;

const variants: {
  variant: LogoVariant;
  label: string;
  size: number;
}[] = [
  { variant: 'mark', label: 'Mark', size: 64 },
  { variant: 'mark-mono', label: 'Mark Mono', size: 64 },
  { variant: 'app-icon', label: 'App Icon', size: 64 },
  { variant: 'wordmark', label: 'Wordmark', size: 48 },
  { variant: 'lockup', label: 'Lockup', size: 56 },
];

function LogoGallery() {
  const { colors } = useTheme();

  const backgrounds = [
    {
      label: 'Light background',
      backgroundColor: colors.bg.screen,
      logoColor: colors.text.primary,
    },
    {
      label: 'Graphite background',
      backgroundColor: colors.bg.inverse,
      logoColor: colors.text.onInverse,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {backgrounds.map((background) => (
        <View key={background.label} style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text.primary },
            ]}
          >
            {background.label}
          </Text>

          <View
            style={[
              styles.variantGrid,
              { backgroundColor: background.backgroundColor },
            ]}
          >
            {variants.map((item) => (
              <View key={item.variant} style={styles.variantItem}>
                <Logo
                  variant={item.variant}
                  size={item.size}
                  color={background.logoColor}
                  backgroundColor={background.backgroundColor}
                />

                <Text
                  style={[
                    styles.variantLabel,
                    { color: background.logoColor },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text.primary },
          ]}
        >
          Mark sizes
        </Text>

        <View
          style={[
            styles.sizesContainer,
            { backgroundColor: colors.bg.surface },
          ]}
        >
          {[16, 24, 32, 48, 64].map((size) => (
            <View key={size} style={styles.sizeItem}>
              <Logo variant="mark" size={size} />

              <Text
                style={[
                  styles.sizeLabel,
                  { color: colors.text.secondary },
                ]}
              >
                {size} px
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export const AllVariants: Story = {
  render: () => <LogoGallery />,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 24,
  },
  variantItem: {
    minWidth: 100,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  variantLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
    gap: 24,
    minHeight: 120,
  },
  sizeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minWidth: 48,
  },
  sizeLabel: {
    fontSize: 12,
  },
});
