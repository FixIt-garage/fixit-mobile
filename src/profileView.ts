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

type CompletionStep<T> = {
  done: (data: T) => boolean;
  hint: string;
};

const CLIENT_STEPS: CompletionStep<Profile>[] = [
  {
    done: (profile) => Boolean(profile.avatarUrl),
    hint: 'Додайте фото — майстрам буде простіше вас впізнати.',
  },
  {
    done: (profile) => Boolean(profile.city),
    hint: 'Вкажіть місто — так ми покажемо майстрів поруч.',
  },
  {
    done: (profile) => Boolean(profile.phone),
    hint: 'Додайте телефон, щоб майстер міг з вами звʼязатися.',
  },
  {
    done: (profile) => Boolean(profile.address),
    hint: 'Додайте адресу — майстру буде простіше вас знайти.',
  },
];

const SERVICES_AND_CITY_HINT = 'Додайте послуги й місто — і клієнти знайдуть вас у пошуку.';

const MASTER_STEPS: CompletionStep<MasterProfile>[] = [
  { done: (master) => master.categoriesCount > 0, hint: SERVICES_AND_CITY_HINT },
  { done: (master) => Boolean(master.city), hint: SERVICES_AND_CITY_HINT },
  {
    done: (master) => master.yearsOfExperience !== null,
    hint: 'Вкажіть досвід — клієнтам буде простіше обрати вас.',
  },
  {
    done: (master) => master.priceFrom !== null,
    hint: 'Вкажіть ціну виклику, щоб клієнти знали, чого чекати.',
  },
  {
    done: (master) => Boolean(master.schedule),
    hint: 'Додайте графік роботи, щоб клієнти знали, коли до вас звертатися.',
  },
];

export type ProfileCompletion = {
  progress: number;
  hint: string;
};

function completion<T>(steps: CompletionStep<T>[], data: T): ProfileCompletion | null {
  const missing = steps.filter((step) => !step.done(data));
  if (missing.length === 0) {
    return null;
  }
  return {
    progress: (steps.length - missing.length) / steps.length,
    hint: missing[0].hint,
  };
}

export function profileCompletion(
  profile: Profile,
  master?: MasterProfile | null,
): ProfileCompletion | null {
    if (profile.role === 'master') {
    return master ? completion(MASTER_STEPS, master) : null;
  }
  return completion(CLIENT_STEPS, profile);
}