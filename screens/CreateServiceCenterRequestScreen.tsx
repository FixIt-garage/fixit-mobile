import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { BackBar } from '../components/BackBar';
import { Button } from '../components/Button';
import { ChipGroup, type ChipOption } from '../components/ChipGroup';
import { Input } from '../components/Input';
import { TextArea } from '../components/TextArea';
import { Text } from '../components/Text';

import type { MainStackParamList } from '../navigation/AppNavigator';
import { createIssue } from '../src/api/issues';
import { useServiceCenter } from '../src/api/serviceCenters';
import { useTheme } from '../src/theme';

type Props = NativeStackScreenProps<
  MainStackParamList,
  'CreateServiceCenterRequest'
>;

export default function CreateServiceCenterRequestScreen({
  navigation,
  route,
}: Props) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { serviceCenterId } = route.params;
  const centerQuery = useServiceCenter(serviceCenterId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const createMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: async (issue) => {
      await queryClient.invalidateQueries({ queryKey: ['issues'] });

      navigation.replace('RequestDetails', {
        issueId: issue.id,
        title: issue.title,
      });
    },
  });

  if (centerQuery.isPending) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.bg.screen }]}
      >
        <ActivityIndicator color={theme.colors.bg.brand} />
      </View>
    );
  }

  if (centerQuery.isError || !centerQuery.data) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}
      >
        <BackBar title="Нова заявка" />
        <View style={styles.errorContainer}>
          <Text variant="body" color="secondary">
            Не вдалося завантажити інформацію про сервісний центр.
          </Text>
          <Button
            label="Спробувати ще раз"
            variant="secondary"
            onPress={() => void centerQuery.refetch()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const center = centerQuery.data;

  const categoryOptions: ChipOption<string>[] = center.categories.map(
    (category) => ({
      value: String(category.id),
      label: category.name,
    }),
  );

  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedCategoryId !== null &&
    !createMutation.isPending;

  const handleSubmit = () => {
    if (!canSubmit || selectedCategoryId === null) {
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      category_id: Number(selectedCategoryId),
      assignee_company_id: center.id,
    });
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.colors.bg.screen }]}
      edges={['top', 'bottom']}
    >
      <BackBar title="Нова заявка" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: theme.layout.screenPadding,
            paddingBottom: theme.spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heading}>
          <Text variant="h1">Опишіть проблему</Text>
          <Text variant="body" color="secondary">
            Заявка буде надіслана до сервісного центру {center.name}.
          </Text>
        </View>

        <View style={styles.field}>
          <Text variant="bodyBold">Категорія послуги</Text>

          {categoryOptions.length > 0 ? (
            <ChipGroup
              mode="single"
              layout="wrap"
              options={categoryOptions}
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
            />
          ) : (
            <Text variant="bodySmall" color="secondary">
              Для цього сервісного центру категорії не вказані.
            </Text>
          )}
        </View>

        <Input
          label="Назва проблеми"
          placeholder="Наприклад, не вмикається ноутбук"
          value={title}
          onChangeText={setTitle}
          maxLength={255}
        />

        <TextArea
          label="Опис проблеми"
          placeholder="Опишіть, що сталося та яка допомога потрібна..."
          value={description}
          onChangeText={setDescription}
          maxLength={500}
          showCounter
        />

        {createMutation.isError ? (
          <Text variant="bodySmall" color="error">
            Не вдалося надіслати заявку. Перевірте з&apos;єднання та спробуйте
            ще раз.
          </Text>
        ) : null}

        <View style={styles.submit}>
          <Button
            label="Надіслати заявку"
            loading={createMutation.isPending}
            disabled={!canSubmit || categoryOptions.length === 0}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  content: {
    gap: 24,
  },
  heading: {
    gap: 8,
  },
  field: {
    gap: 12,
  },
  submit: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
});
