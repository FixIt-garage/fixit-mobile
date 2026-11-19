import { MOCK_MASTER_PROFILE } from './api/masterProfile';
import { buildPatch, formatLocation, parseLocation, toFormValues } from './masterProfileForm';

const master = {
    ...MOCK_MASTER_PROFILE,
    city: 'Львів',
    district: null,
    experienceYears: 7,
    callOutPrice: 300,
    schedule: null,
    categoryIds: [1],
};

describe('location', () => {
    it('splits city and district by the first comma', () => {
        expect(parseLocation('Львів, Сихів')).toEqual({ city: 'Львів', district: 'Сихів' });
        expect(parseLocation('Львів')).toEqual({ city: 'Львів', district: null });
        expect(parseLocation('  ')).toEqual({ city: null, district: null });
    });
    it('keeps a district without a city on a round trip', () => {
        expect(formatLocation(null, 'Сихів')).toBe(', Сихів');
        expect(parseLocation(', Сихів')).toEqual({ city: null, district: 'Сихів' });
    });
    it('joins city and district', () => {
        expect(formatLocation('Львів', 'Сихів')).toBe('Львів, Сихів');
        expect(formatLocation('Львів', null)).toBe('Львів');
    });
});

describe('buildPatch', () => {
    it('sends nothing when nothing changed', () => {
        expect(buildPatch(toFormValues(master), master)).toEqual({});
    });

    it('sends only the changed fields', () => {
        const values = { ...toFormValues(master), schedule: 'Пн–Сб, 9:00–19:00', location: 'Львів, Сихів' };

        expect(buildPatch(values, master)).toEqual({
            district: 'Сихів',
            schedule: 'Пн–Сб, 9:00–19:00',
        });
    });

    it('clears a field with null and replaces the category list', () => {
        const values = { ...toFormValues(master), experience: '', categoryIds: ['2', '3'] };

        expect(buildPatch(values, master)).toEqual({
            experience_years: null,
            category_ids: [2, 3],
        });
    });

    it('parses a price with a comma', () => {
        const values = { ...toFormValues(master), price: '350,50' };

        expect(buildPatch(values, master)).toEqual({ call_out_price: 350.5 });
    });
  it.each([
    ['district without a city', { city: null, district: 'Сихів' }],
    ['city without a district', { city: 'Львів', district: null }],
    ['city and district', { city: 'Львів', district: 'Сихів' }],
    ['no city and no district', { city: null, district: null }],
  ])('does not rewrite the address when saved unchanged: %s', (_name, address) => {
    const profile = { ...master, ...address };

    expect(buildPatch(toFormValues(profile), profile)).toEqual({});
  });
});