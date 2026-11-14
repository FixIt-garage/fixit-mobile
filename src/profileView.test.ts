import { MOCK_PROFILE } from './api/profile';
import { displayPhone, formatPublicId, profileCompletion, profileMeta } from './profileView';

describe('profileView', () => {
  it('builds the meta line', () => {
    expect(profileMeta(MOCK_PROFILE)).toBe('Клієнт · Львів · ID 3120');
    expect(profileMeta({ ...MOCK_PROFILE, city: null })).toBe('Клієнт · ID 3120');
  });

  it('pads the public id', () => {
    expect(formatPublicId(247)).toBe('ID 0247');
  });

  it('formats the phone for display', () => {
    expect(displayPhone('+380671234567')).toBe('+380 67 123 45 67');
  });

  it('starts with the photo hint', () => {
    expect(profileCompletion(MOCK_PROFILE)).toEqual({
      progress: 0.75,
      hint: 'Додайте фото — майстрам буде простіше вас впізнати.',
    });
  });

  it('hides completion when everything is filled', () => {
    expect(profileCompletion({ ...MOCK_PROFILE, avatarUrl: 'https://x.ua/a.png' })).toBeNull();
  });
});