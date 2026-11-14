import type { Profile } from './api/profile';
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

export type ProfileCompletion = {
  progress: number;
  hint: string;
};

export function profileCompletion(profile: Profile): ProfileCompletion | null {
  const missing = CLIENT_STEPS.filter((step) => !step.done(profile));
  if (missing.length === 0) {
    return null;
  }
  return {
    progress: (CLIENT_STEPS.length - missing.length) / CLIENT_STEPS.length,
    hint: missing[0].hint,
  };
}