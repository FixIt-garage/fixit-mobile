export function pluralUk(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }
  return many;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

export function formatReviews(count: number): string {
  return `${count} ${pluralUk(count, 'відгук', 'відгуки', 'відгуків')}`;
}

const SHORT_MONTHS = [
  'січ.',
  'лют.',
  'берез.',
  'квіт.',
  'трав.',
  'черв.',
  'лип.',
  'серп.',
  'вер.',
  'жовт.',
  'лист.',
  'груд.',
];

export function formatShortDate(date: Date): string {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
}

export function formatShortDateTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatShortDate(date)}, ${hours}:${minutes}`;
}