const UKRAINIAN_LETTER = /[а-щьюяіїєґ]$/i;
const VOWELS = 'аеєиіїоуюя';

export function toVocative(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || !UKRAINIAN_LETTER.test(trimmed)) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  const last = lower[lower.length - 1];
  const stem = trimmed.slice(0, -1);

  if (lower.endsWith('ія')) {
    return `${stem}є`;
  }
  if (last === 'я') {
    return `${stem}ю`;
  }
  if (last === 'а') {
    return `${stem}о`;
  }
  if (last === 'й' || last === 'ь') {
    return `${stem}ю`;
  }
  if (last === 'о') {
    return `${stem}е`;
  }
  if (!VOWELS.includes(last)) {
    return `${trimmed}е`;
  }
  return trimmed;
}

export function greeting(firstName: string): string {
  const name = toVocative(firstName);
  return name ? `Привіт, ${name}` : 'Привіт';
}

export function timeOfDayGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return 'Доброго ранку';
  }
  if (hour >= 12 && hour < 18) {
    return 'Добрий день';
  }
  if (hour >= 18 && hour < 23) {
    return 'Добрий вечір';
  }
  return 'Доброї ночі';
}

export function timeGreeting(firstName: string, date: Date): string {
  const name = toVocative(firstName);
  const base = timeOfDayGreeting(date.getHours());
  return name ? `${base}, ${name}` : base;
}