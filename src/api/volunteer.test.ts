import { toVolunteerRequest, volunteerRequestsQuery } from './volunteer';

const RESPONSE = {
  id: 7,
  title: 'Полагодити обігрівачі в притулку',
  description: 'Потрібні електрики',
  category_id: 2,
  address: 'вул. Сихівська, 10',
  city: 'Львів',
  district: 'Сихів',
  event_date: '2026-12-05T10:00:00Z',
  status: 'open',
  joined: 2,
  needed: 5,
  is_joined: false,
  organization: { id: 3, name: 'БФ «Тепла хата»', is_verified: true },
};

describe('toVolunteerRequest', () => {
  it('maps the card fields', () => {
    expect(toVolunteerRequest(RESPONSE)).toEqual({
      id: 7,
      title: 'Полагодити обігрівачі в притулку',
      organizationName: 'БФ «Тепла хата»',
      eventDate: new Date('2026-12-05T10:00:00Z'),
      place: 'Сихів',
      joined: 2,
      needed: 5,
      isJoined: false,
    });
  });

  it('falls back to the city when there is no district', () => {
    expect(toVolunteerRequest({ ...RESPONSE, district: null })?.place).toBe('Львів');
  });

  it('skips a request without a date', () => {
    expect(toVolunteerRequest({ ...RESPONSE, event_date: null })).toBeNull();
  });
});

describe('volunteerRequestsQuery', () => {
  it('adds the city only when it is known', () => {
    expect(volunteerRequestsQuery('Львів', 3, 0)).toBe(
      `city=${encodeURIComponent('Львів')}&limit=3&offset=0`,
    );
    expect(volunteerRequestsQuery(null, 3, 0)).toBe('limit=3&offset=0');
  });
});