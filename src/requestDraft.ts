import AsyncStorage from '@react-native-async-storage/async-storage';

// Чернетка форми «Що зламалося?» з екрана 08. Лежить у пам'яті телефона,
// тож не губиться, якщо зникне інтернет або застосунок закриють.
// У кожного акаунта своя чернетка: на одному телефоні можуть по черзі входити різні люди.
const REQUEST_DRAFT_KEY_PREFIX = 'fixit/request-draft';

export function requestDraftKey(userId: number) {
  return `${REQUEST_DRAFT_KEY_PREFIX}/${userId}`;
}

export type RequestDraft = {
  city: string;
  categoryId: string;
  description: string;
};

/** Чи є в чернетці щось, крім міста (місто підставляється з профілю саме). */
export function hasDraftContent(draft: RequestDraft) {
  return draft.categoryId !== '' || draft.description.trim() !== '';
}

function isRequestDraft(value: unknown): value is RequestDraft {
  if (typeof value !== 'object' || value === null) return false;
  const draft = value as Record<string, unknown>;
  return (
    typeof draft.city === 'string' &&
    typeof draft.categoryId === 'string' &&
    typeof draft.description === 'string'
  );
}

export async function loadRequestDraft(
  userId: number,
): Promise<RequestDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(requestDraftKey(userId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isRequestDraft(parsed) ? parsed : null;
  } catch {
    // Пошкоджена чернетка не має ламати екран — просто починаємо з порожньої форми
    return null;
  }
}

export async function saveRequestDraft(userId: number, draft: RequestDraft) {
  try {
    if (hasDraftContent(draft)) {
      await AsyncStorage.setItem(
        requestDraftKey(userId),
        JSON.stringify(draft),
      );
    } else {
      await AsyncStorage.removeItem(requestDraftKey(userId));
    }
  } catch {
    // Не вдалося зберегти — форма однаково працює, втрачається лише чернетка
  }
}

/** Для екрана створення заявки: викликати після успішного `POST /issues`. */
export async function clearRequestDraft(userId: number) {
  try {
    await AsyncStorage.removeItem(requestDraftKey(userId));
  } catch {
    // Нічого страшного: стара чернетка просто підставиться наступного разу
  }
}
