import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  REQUEST_DRAFT_KEY,
  clearRequestDraft,
  loadRequestDraft,
  saveRequestDraft,
} from './requestDraft';

const draft = {
  city: 'Львів',
  categoryId: '1',
  description: 'Пральна машина не зливає воду',
};

describe('request draft', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('saves and loads the draft', async () => {
    await saveRequestDraft(draft);

    await expect(loadRequestDraft()).resolves.toEqual(draft);
  });

  it('does not keep a draft that has only the city', async () => {
    await saveRequestDraft(draft);
    await saveRequestDraft({
      city: 'Львів',
      categoryId: '',
      description: '  ',
    });

    await expect(loadRequestDraft()).resolves.toBeNull();
  });

  it('clears the draft', async () => {
    await saveRequestDraft(draft);
    await clearRequestDraft();

    await expect(loadRequestDraft()).resolves.toBeNull();
  });

  it('ignores a broken draft', async () => {
    await AsyncStorage.setItem(REQUEST_DRAFT_KEY, '{not json');
    await expect(loadRequestDraft()).resolves.toBeNull();

    await AsyncStorage.setItem(REQUEST_DRAFT_KEY, JSON.stringify({ city: 1 }));
    await expect(loadRequestDraft()).resolves.toBeNull();
  });
});
