import type { Profile } from './api/profile';
import type { MasterProfile } from './api/masterProfile';
import { formatPhone, phoneDigits } from './auth/signUpForm';
import type { Role } from './roles';

const ROLE_LABELS: Record<Role, string> = {
  client: 'Клієнт',
  master: 'Майстер',
  center: 'Сервісний центр',
  org: 'Організація',
};

export function formatPublicId(publicId: number): string {
  return `ID ${String(publicId).padStart(4, '0')}`;
}

export function profileMeta(profile: Profile): string {
  return [ROLE_LABELS[profile.role], profile.city, formatPublicId(profile.publicId)]
    .filter(Boolean)
    .join(' · ');
}

export function displayPhone(phone: string): string {
  const digits = phoneDigits(phone);
  return digits.length === 9 ? formatPhone(digits) : phone;
}

export type ProfileCompletion = {
  progress: number;
  hint: string;
};

type CompletionStep = {
  done: (profile: Profile) => boolean;
  hint: string;
};

const CLIENT_STEPS: CompletionStep[] = [
  {
    done: (profile) => Boolean(profile.avatarUrl),
    hint: 'Додайте фото — майстрам буде простіше вас впізнати.',
  },
  {
    done: (profile) => Boolean(profile.phone),
    hint: 'Додайте телефон, щоб майстер міг з вами звʼязатися.',
  },
  {
    done: (profile) => Boolean(profile.address),
    hint: 'Додайте адресу — майстру буде простіше вас знайти.',
  },
  {
    done: (profile) => Boolean(profile.city),
    hint: 'Вкажіть місто — так ми покажемо майстрів поруч.',
  },
];

function clientCompletion(profile: Profile): ProfileCompletion | null {
  const missing = CLIENT_STEPS.filter((step) => !step.done(profile));
  if (missing.length === 0) {
    return null;
  }
  return {
    progress: (CLIENT_STEPS.length - missing.length) / CLIENT_STEPS.length,
    hint: missing[0].hint,
  };
}

const SERVICES_AND_CITY_HINT = 'Додайте послуги й місто — і клієнти знайдуть вас у пошуку.';

const MASTER_HINTS: Record<string, string> = {
  categories: SERVICES_AND_CITY_HINT,
  category_ids: SERVICES_AND_CITY_HINT,
  city: SERVICES_AND_CITY_HINT,
  experience_years: 'Вкажіть досвід — клієнтам буде простіше обрати вас.',
  call_out_price: 'Вкажіть ціну виклику, щоб клієнти знали, чого чекати.',
  schedule: 'Додайте графік роботи, щоб клієнти знали, коли до вас звертатися.',
};

export const MASTER_FALLBACK_HINT = 'Заповніть профіль, щоб клієнти знайшли вас у пошуку.';

function masterCompletion(master: MasterProfile): ProfileCompletion | null {
  const { percent, nextField } = master.completeness;
  if (percent >= 100 || nextField === null) {
    return null;
  }
  return {
    progress: percent / 100,
    hint: MASTER_HINTS[nextField] ?? MASTER_FALLBACK_HINT,
  };
}

export function profileCompletion(
  profile: Profile,
  master?: MasterProfile | null,
): ProfileCompletion | null {
  if (profile.role === 'master') {
    return master ? masterCompletion(master) : null;
  }
  return clientCompletion(profile);
}