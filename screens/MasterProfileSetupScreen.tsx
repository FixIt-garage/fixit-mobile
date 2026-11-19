import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { ApiError } from '../api/client';
import { useTheme } from '../src/theme';
import { useCategories, type Category } from '../src/api/categories';
import { useMyProfile } from '../src/api/profile';
import {
  useMyMasterProfile,
  useUpdateMasterProfile,
  type MasterProfile,
  type MasterProfilePatch,
} from '../src/api/masterProfile';
import {
  buildPatch,
  masterProfileSchema,
  toFormValues,
  type MasterProfileValues,
} from '../src/masterProfileForm';
import { Button } from '../components/Button';
import { ChipGroup } from '../components/ChipGroup';
import { Icon } from '../components/Icon';
import { Input } from '../components/Input';
import { ProgressBar } from '../components/ProgressBar';
import { Text } from '../components/Text';

type Props = NativeStackScreenProps<MainStackParamList, 'MasterProfileSetup'>;

export type CategoriesState = 'loading' | 'error' | 'ready';

export type MasterProfileSetupViewProps = {
  master: MasterProfile;
  categories: Category[];
  categoriesState: CategoriesState;
  onRetryCategories: () => void;
  onBack: () => void;
  onSave: (patch: MasterProfilePatch) => Promise<void>;
};

export function MasterProfileSetupView({
  master,
  categories,
  categoriesState,
  onRetryCategories,
  onBack,
  onSave,
}: MasterProfileSetupViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [formError, setFormError] = useState<string | null>(null);
  const { filled, total, percent } = master.completeness;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MasterProfileValues>({
    resolver: zodResolver(masterProfileSchema),
    defaultValues: toFormValues(master),
  });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSave(buildPatch(values, master));
    } catch (error) {
      setFormError(
        error instanceof ApiError && error.status === 422
          ? 'Перевірте дані у формі.'
          : 'Не вдалося зберегти. Перевірте інтернет і спробуйте ще раз.',
      );
    }
  });

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}>
      <StatusBar style="dark" />
      <View
        style={{
          backgroundColor: theme.colors.bg.surface,
          paddingTop: insets.top,
          paddingBottom: theme.spacing.sm,
        }}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            onPress={onBack}
            hitSlop={4}
            style={styles.back}
          >
            <Icon name="chevron-left" size={22} color="text/primary" />
          </Pressable>
          <View style={styles.titles}>
            <Text variant="h3" accessibilityRole="header">
              Профіль майстра
            </Text>
            <Text variant="labelMono" color="secondary">
              {`Заповнено ${filled} з ${total} · можна пізніше`}
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: theme.layout.screenPadding }}>
          <ProgressBar value={percent / 100} gradient="master" />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: theme.layout.screenPadding,
              paddingBottom: Math.max(insets.bottom, theme.layout.bottomInset),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text variant="bodySmall">Що ремонтуєте?</Text>
          {categoriesState === 'loading' ? (
            <ActivityIndicator
              accessibilityLabel="Завантаження категорій"
              color={theme.colors.role.master}
              style={styles.loader}
            />
          ) : categoriesState === 'error' ? (
            <View style={styles.categoriesError}>
              <Text variant="bodySmall" color="secondary">
                Не вдалося завантажити категорії
              </Text>
              <Pressable accessibilityRole="button" onPress={onRetryCategories} hitSlop={8}>
                <Text variant="bodyBold" style={{ color: theme.colors.role.master }}>
                  Спробувати ще раз
                </Text>
              </Pressable>
            </View>
          ) : (
            <Controller
              control={control}
              name="categoryIds"
              render={({ field }) => (
                <ChipGroup
                  mode="multiple"
                  layout="wrap"
                  accent="master"
                  options={categories.map((category) => ({
                    value: String(category.id),
                    label: category.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="location"
            render={({ field, fieldState }) => (
              <Input
                label="Місто і район"
                placeholder="Наприклад: Львів, Сихів"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="experience"
            render={({ field, fieldState }) => (
              <Input
                label="Досвід, років"
                placeholder="Наприклад: 5"
                keyboardType="number-pad"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field, fieldState }) => (
              <Input
                label="Ціна виклику, грн"
                placeholder="Наприклад: 300"
                keyboardType="decimal-pad"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="schedule"
            render={({ field, fieldState }) => (
              <Input
                label="Графік роботи"
                placeholder="Наприклад: Пн–Сб, 9:00–19:00"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />

          <View style={styles.spacer} />

          {formError ? (
            <Text variant="bodySmall" color="error" accessibilityRole="alert">
              {formError}
            </Text>
          ) : null}

          <Button
            label={isSubmitting ? 'Зберігаємо…' : 'Зберегти'}
            gradient="master"
            onPress={() => {
              if (!isSubmitting) {
                void submit();
              }
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function MasterProfileSetupScreen({ navigation }: Props) {
  const theme = useTheme();
  const profileQuery = useMyProfile();
  const userId = profileQuery.data?.id;
  const masterQuery = useMyMasterProfile(userId, true);
  const categoriesQuery = useCategories();
  const update = useUpdateMasterProfile(userId);
  const goBack = () => navigation.goBack();

  if (profileQuery.isError || masterQuery.isError) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: theme.colors.bg.screen,
            padding: theme.layout.screenPadding,
            gap: theme.spacing.md,
          },
        ]}
      >
        <Text variant="h2" style={styles.centerText}>
          Не вдалося завантажити профіль
        </Text>
        <Button
          label="Спробувати ще раз"
          gradient="master"
          onPress={() => {
            void profileQuery.refetch();
            void masterQuery.refetch();
          }}
        />
        <Button label="Назад" variant="secondary" onPress={goBack} />
      </View>
    );
  }

  if (!masterQuery.data) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.bg.screen }]}>
        <ActivityIndicator accessibilityLabel="Завантаження профілю" color={theme.colors.role.master} />
      </View>
    );
  }

  const categoriesState: CategoriesState = categoriesQuery.isError
    ? 'error'
    : categoriesQuery.isPending
      ? 'loading'
      : 'ready';

  return (
    <MasterProfileSetupView
      master={masterQuery.data}
      categories={categoriesQuery.data ?? []}
      categoriesState={categoriesState}
      onRetryCategories={() => void categoriesQuery.refetch()}
      onBack={goBack}
      onSave={async (patch) => {
        if (Object.keys(patch).length > 0) {
          await update.mutateAsync(patch);
        }
        goBack();
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    height: 56,
    paddingTop: 2,
    paddingLeft: 8,
    paddingRight: 20,
    gap: 8,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
    paddingTop: 10,
    gap: 2,
  },
  content: {
    flexGrow: 1,
    paddingTop: 16,
    gap: 14,
  },
  loader: {
    alignSelf: 'flex-start',
    height: 36,
  },
  categoriesError: {
    gap: 4,
  },
  spacer: {
    flex: 1,
    minHeight: 12,
  },
});