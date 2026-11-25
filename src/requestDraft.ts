import AsyncStorage from '@react-native-async-storage/async-storage';

// Чернетка форми «Що зламалося?» з екрана 08. Лежить у пам'яті телефона,
// тож не губиться, якщо зникне інтернет або застосунок закриють.
export const REQUEST_DRAFT_KEY = 'fixit/request-draft';

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

export async function loadRequestDraft(): Promise<RequestDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(REQUEST_DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isRequestDraft(parsed) ? parsed : null;
  } catch {
    // Пошкоджена чернетка не має ламати екран — просто починаємо з порожньої форми
    return null;
  }
}

export async function saveRequestDraft(draft: RequestDraft) {
  try {
    if (hasDraftContent(draft)) {
      await AsyncStorage.setItem(REQUEST_DRAFT_KEY, JSON.stringify(draft));
    } else {
      await AsyncStorage.removeItem(REQUEST_DRAFT_KEY);
    }
  } catch {
    // Не вдалося зберегти — форма однаково працює, втрачається лише чернетка
  }
}

export async function clearRequestDraft() {
  try {
    await AsyncStorage.removeItem(REQUEST_DRAFT_KEY);
  } catch {
    // Нічого страшного: стара чернетка просто підставиться наступного разу
  }
}
