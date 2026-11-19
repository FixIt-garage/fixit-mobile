import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { MOCK_CATEGORIES } from '../src/api/categories';
import { MOCK_MASTER_PROFILE } from '../src/api/masterProfile';
import { MasterProfileSetupView } from './MasterProfileSetupScreen';

const master = {
  ...MOCK_MASTER_PROFILE,
  city: 'Львів',
  district: null,
  experienceYears: 7,
  callOutPrice: 300,
  schedule: null,
  categoryIds: [1],
};

async function renderView(onSave = jest.fn().mockResolvedValue(undefined)) {
  await render(
    <MasterProfileSetupView
      master={master}
      categories={MOCK_CATEGORIES}
      categoriesState="ready"
      onRetryCategories={jest.fn()}
      onBack={jest.fn()}
      onSave={onSave}
    />,
  );
  return onSave;
}

describe('MasterProfileSetupView', () => {
  it('prefills the form from the master profile', async () => {
    await renderView();

    expect(screen.getByText('Заповнено 2 з 5 · можна пізніше')).toBeTruthy();
    expect(screen.getByDisplayValue('Львів')).toBeTruthy();
    expect(screen.getByDisplayValue('7')).toBeTruthy();
    expect(screen.getByDisplayValue('300')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Побутова техніка' }).props.accessibilityState,
    ).toMatchObject({ selected: true });
  });

  it('saves only the changed fields', async () => {
    const onSave = await renderView();

    await fireEvent.changeText(screen.getByLabelText('Графік роботи'), 'Пн–Сб, 9:00–19:00');
    await fireEvent.press(screen.getByRole('button', { name: 'Сантехніка' }));
    await fireEvent.press(screen.getByText('Зберегти'));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        category_ids: [1, 3],
        schedule: 'Пн–Сб, 9:00–19:00',
      }),
    );
  });

  it('validates numbers', async () => {
    const onSave = await renderView();

    await fireEvent.changeText(screen.getByLabelText('Досвід, років'), '75');
    await fireEvent.changeText(screen.getByLabelText('Ціна виклику, грн'), 'від 300 грн');
    await fireEvent.press(screen.getByText('Зберегти'));

    expect(await screen.findByText('Від 0 до 60 років')).toBeTruthy();
    expect(screen.getByText('Вкажіть суму числом, наприклад 300')).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows an error when saving fails', async () => {
    await renderView(jest.fn().mockRejectedValue(new Error('offline')));

    await fireEvent.press(screen.getByText('Зберегти'));

    expect(
      await screen.findByText('Не вдалося зберегти. Перевірте інтернет і спробуйте ще раз.'),
    ).toBeTruthy();
  });
});