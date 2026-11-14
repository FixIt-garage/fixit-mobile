import { MOCK_PROFILE } from './api/profile';
import { MOCK_MASTER_PROFILE } from './api/masterProfile';
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
describe('master completion', () => {
  it('starts with services and city for a new master', () => {
    const master = { ...MOCK_PROFILE, role: 'master' as const };
    expect(profileCompletion(master, MOCK_MASTER_PROFILE)).toEqual({
      progress: 0.4,
      hint: 'Додайте послуги й місто — і клієнти знайдуть вас у пошуку.',
    });
  });
});