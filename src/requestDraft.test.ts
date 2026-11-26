import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearRequestDraft,
  loadRequestDraft,
  requestDraftKey,
  saveRequestDraft,
} from './requestDraft';

const ANNA = 1;
const BOHDAN = 2;

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
    await saveRequestDraft(ANNA, draft);

    await expect(loadRequestDraft(ANNA)).resolves.toEqual(draft);
  });

  it('does not keep a draft that has only the city', async () => {
    await saveRequestDraft(ANNA, draft);
    await saveRequestDraft(ANNA, {
      city: 'Львів',
      categoryId: '',
      description: '  ',
    });

    await expect(loadRequestDraft(ANNA)).resolves.toBeNull();
  });

  it('keeps a separate draft for each account on the same phone', async () => {
    await saveRequestDraft(ANNA, draft);

    await expect(loadRequestDraft(BOHDAN)).resolves.toBeNull();

    await clearRequestDraft(BOHDAN);
    await expect(loadRequestDraft(ANNA)).resolves.toEqual(draft);
  });

  it('clears the draft', async () => {
    await saveRequestDraft(ANNA, draft);
    await clearRequestDraft(ANNA);

    await expect(loadRequestDraft(ANNA)).resolves.toBeNull();
  });

  it('ignores a broken draft', async () => {
    await AsyncStorage.setItem(requestDraftKey(ANNA), '{not json');
    await expect(loadRequestDraft(ANNA)).resolves.toBeNull();

    await AsyncStorage.setItem(
      requestDraftKey(ANNA),
      JSON.stringify({ city: 1 }),
    );
    await expect(loadRequestDraft(ANNA)).resolves.toBeNull();
  });
});
