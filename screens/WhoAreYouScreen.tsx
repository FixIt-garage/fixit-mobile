import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../src/theme';
import { ROLES } from '../src/roles';
import { CARD_GAP, SNAP, activeIndexForOffset, carouselEndPadding } from '../src/roleCarousel';
import { Text } from '../components/Text';
import { ProgressBar } from '../components/ProgressBar';
import { RoleCard } from '../components/RoleCard';

type Props = NativeStackScreenProps<RootStackParamList, 'WhoAreYou'>;

export default function WhoAreYouScreen({ navigation }: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRole = ROLES[activeIndex].role;
  const sidePadding = theme.layout.screenPadding;

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(activeIndexForOffset(event.nativeEvent.contentOffset.x, ROLES.length));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}>
      <View style={{ paddingHorizontal: sidePadding, paddingTop: theme.spacing.md }}>
        <View style={[styles.stepRow, { gap: theme.spacing.sm }]}>
          <Text variant="labelMonoBold" color="brand">
            Крок 1 / 2
          </Text>
          <ProgressBar value={0.5} height={6} style={styles.progress} />
        </View>
        <Text variant="display" style={{ marginTop: theme.spacing.sm }}>
          Хто ви?
        </Text>
        <Text variant="body" color="secondary" style={{ marginTop: theme.spacing.xs }}>
          Як ви будете користуватися FixIt?
        </Text>
      </View>

      <FlatList
        data={ROLES}
        keyExtractor={(item) => item.role}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        style={styles.carousel}
        contentContainerStyle={{
          paddingLeft: sidePadding,
          // Щоб остання картка могла стати на місце першої навіть на iPad
          paddingRight: carouselEndPadding(width, sidePadding),
          gap: CARD_GAP,
          paddingVertical: theme.spacing.xxl,
          alignItems: 'flex-start',
        }}
        renderItem={({ item, index }) => (
          <RoleCard
            kicker={item.kicker}
            title={item.title}
            description={item.description}
            buttonLabel={item.buttonLabel}
            gradient={item.role}
            onPress={() => navigation.navigate('SignUp', { role: item.role })}
            // Картки не в центрі — напівпрозорі, як у Figma
            style={index !== activeIndex && styles.inactiveCard}
          />
        )}
      />

      <View style={[styles.dots, { gap: theme.spacing.xs }]} accessibilityElementsHidden>
        {ROLES.map((item, index) => (
          <View
            key={item.role}
            style={[
              styles.dot,
              index === activeIndex
                ? [styles.dotActive, { backgroundColor: theme.colors.role[activeRole] }]
                : { backgroundColor: theme.colors.border.default },
            ]}
          />
        ))}
      </View>
      <Text variant="labelMono" color="secondary" style={styles.hint}>
        ← гортайте →
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    width: 118,
  },
  carousel: {
    flexGrow: 0,
  },
  inactiveCard: {
    opacity: 0.5,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 28,
  },
  hint: {
    textAlign: 'center',
    paddingTop: 14,
  },
});