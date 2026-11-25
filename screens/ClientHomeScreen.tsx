import { useCallback, useEffect, useRef, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { MainStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../src/theme';
import { useAuth } from '../src/auth/AuthProvider';
import { useCategories, type Category } from '../src/api/categories';
import { useMyProfile } from '../src/api/profile';
import { greeting } from '../src/greeting';
import {
  clearRequestDraft,
  loadRequestDraft,
  saveRequestDraft,
  type RequestDraft,
} from '../src/requestDraft';
import { BottomSheet, BOTTOM_SHEET_RADIUS } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { ChipGroup } from '../components/ChipGroup';
import { GreetingHeader } from '../components/GreetingHeader';
import { Input } from '../components/Input';
import { Text } from '../components/Text';
import { TextArea } from '../components/TextArea';

const TAB_BAR_HEIGHT = 64;
export const DESCRIPTION_MAX = 500;

const searchSchema = z.object({
  city: z.string().trim().max(100, 'Не більше 100 символів'),
  categoryId: z.string().min(1, 'Оберіть категорію'),
  description: z
    .string()
    .trim()
    .min(1, 'Опишіть, що зламалося')
    .max(DESCRIPTION_MAX, `Не більше ${DESCRIPTION_MAX} символів`),
});

type SearchValues = z.infer<typeof searchSchema>;

export type ClientHomeSearch = {
  city: string;
  categoryId: number;
  description: string;
};

export type CategoriesState = 'loading' | 'error' | 'ready';

export type ClientHomeViewProps = {
  firstName: string;
  lastName?: string;
  initialCity?: string | null;
  categories: Category[];
  categoriesState: CategoriesState;
  onRetryCategories: () => void;
  onSearch: (search: ClientHomeSearch) => void;
  /** Збережена чернетка: підставляється в поля, яких людина ще не торкалася */
  draft?: RequestDraft | null;
  /** Викликається на кожну зміну форми, щоб зберегти чернетку */
  onDraftChange?: (draft: RequestDraft) => void;
};

export function ClientHomeView({
  firstName,
  initialCity,
  categories,
  categoriesState,
  onRetryCategories,
  onSearch,
  draft,
  onDraftChange,
}: ClientHomeViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, setValue, getValues, getFieldState, formState } =
    useForm<SearchValues>({
      resolver: zodResolver(searchSchema),
      defaultValues: { city: initialCity ?? '', categoryId: '', description: '' },
    });

  useEffect(() => {
    if (initialCity && !getValues('city') && !getFieldState('city').isDirty) {
      setValue('city', initialCity);
    }
  }, [initialCity, getValues, getFieldState, setValue]);

  // Чернетка приходить зі сховища із затримкою: не перезаписуємо те, що людина вже ввела
  useEffect(() => {
    if (!draft) return;
    (['city', 'categoryId', 'description'] as const).forEach((field) => {
      if (draft[field] && !getFieldState(field).isDirty) {
        setValue(field, draft[field]);
      }
    });
  }, [draft, getFieldState, setValue]);

  // Зберігаємо чернетку лише після того, як людина щось змінила сама:
  // автопідставлене місто чи відновлена чернетка не перезаписують сховище
  const watched = useWatch({ control });
  const userEdited = useRef(false);
  const { isDirty } = formState;

  useEffect(() => {
    if (isDirty) userEdited.current = true;
    if (!userEdited.current || !onDraftChange) return;
    onDraftChange({
      city: watched.city ?? '',
      categoryId: watched.categoryId ?? '',
      description: watched.description ?? '',
    });
  }, [watched.city, watched.categoryId, watched.description, isDirty, onDraftChange]);

  const submit = handleSubmit((values) => {
    onSearch({
      city: values.city.trim(),
      categoryId: Number(values.categoryId),
      description: values.description.trim(),
    });
  });

  const categoryError = formState.errors.categoryId?.message;

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <GreetingHeader
            kicker={greeting(firstName)}
            title="Що зламалося?"
            overlap={BOTTOM_SHEET_RADIUS}
          />

          <BottomSheet
            style={[
              styles.sheet,
              {
                paddingBottom:
                  TAB_BAR_HEIGHT + Math.max(insets.bottom, theme.layout.bottomInset) + theme.spacing.lg,
              },
            ]}
          >
            <View style={styles.form}>
              <Controller
                control={control}
                name="city"
                render={({ field, fieldState }) => (
                  <Input
                    label="Місто"
                    placeholder="Ваше місто"
                    textContentType="addressCity"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <View style={styles.categories}>
                <Text variant="bodySmall">Категорія</Text>
                {categoriesState === 'loading' ? (
                  <ActivityIndicator
                    accessibilityLabel="Завантаження категорій"
                    color={theme.colors.bg.brand}
                    style={styles.categoriesLoader}
                  />
                ) : categoriesState === 'error' ? (
                  <View style={styles.categoriesError}>
                    <Text variant="bodySmall" color="secondary">
                      Не вдалося завантажити категорії
                    </Text>
                    <Pressable accessibilityRole="button" onPress={onRetryCategories} hitSlop={8}>
                      <Text variant="bodyBold" color="brand">
                        Спробувати ще раз
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <ChipGroup
                        mode="single"
                        options={categories.map((category) => ({
                          value: String(category.id),
                          label: category.name,
                        }))}
                        value={field.value || null}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {categoryError ? (
                  <Text variant="caption" color="error">
                    {categoryError}
                  </Text>
                ) : null}
              </View>

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <TextArea
                    label="Що зламалося?"
                    placeholder="Наприклад: пральна машина Bosch не зливає воду"
                    maxLength={DESCRIPTION_MAX}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Button label="Знайти майстра" onPress={() => void submit()} />
            </View>
          </BottomSheet>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function ClientHomeScreen() {
  const { state } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const profileQuery = useMyProfile();
  const categoriesQuery = useCategories();

  const firstName = state.status === 'signedIn' ? state.user.firstName : '';
  const lastName = state.status === 'signedIn' ? state.user.lastName : '';
  const categoriesState: CategoriesState = categoriesQuery.isError
    ? 'error'
    : categoriesQuery.isPending
      ? 'loading'
      : 'ready';
  const topCategories = (categoriesQuery.data ?? []).filter((category) => category.parentId === null);

  const [draft, setDraft] = useState<RequestDraft | null>(null);

  useEffect(() => {
    let active = true;
    void loadRequestDraft().then((saved) => {
      if (active) setDraft(saved);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleDraftChange = useCallback((next: RequestDraft) => {
    void saveRequestDraft(next);
  }, []);

  return (
    <ClientHomeView
      firstName={firstName}
      lastName={lastName}
      initialCity={profileQuery.data?.city}
      categories={topCategories}
      categoriesState={categoriesState}
      onRetryCategories={() => void categoriesQuery.refetch()}
      onSearch={(search) => {
        // Запит пішов у пошук — чернетка більше не потрібна
        void clearRequestDraft();
        navigation.navigate('SearchResults', search);
      }}
      draft={draft}
      onDraftChange={handleDraftChange}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  sheet: {
    flex: 1,
    marginTop: -BOTTOM_SHEET_RADIUS,
  },
  form: {
    paddingTop: 12,
    gap: 14,
  },
  categories: {
    gap: 8,
  },
  categoriesLoader: {
    alignSelf: 'flex-start',
    height: 36,
  },
  categoriesError: {
    gap: 4,
  },
});