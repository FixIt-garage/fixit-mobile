import { z } from 'zod';
import { ApiError } from '../../api/client';

export const NAME_MAX = 100;
export const ADDRESS_MAX = 255;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

export const signUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'Вкажіть імʼя')
    .max(NAME_MAX, `Не більше ${NAME_MAX} символів`),
  lastName: z
    .string()
    .trim()
    .min(1, 'Вкажіть прізвище')
    .max(NAME_MAX, `Не більше ${NAME_MAX} символів`),
  phone: z.string().regex(/^\d{9}$/, 'Введіть номер повністю'),
  email: z.string().trim().min(1, 'Вкажіть пошту').email('Перевірте адресу пошти'),
  address: z
    .string()
    .trim()
    .min(1, 'Вкажіть адресу')
    .max(ADDRESS_MAX, `Не більше ${ADDRESS_MAX} символів`),
  password: z
    .string()
    .min(PASSWORD_MIN, `Щонайменше ${PASSWORD_MIN} символів`)
    .max(PASSWORD_MAX, `Не більше ${PASSWORD_MAX} символів`),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export function phoneDigits(text: string): string {
  let digits = text.replace(/\D/g, '');
  if (digits.startsWith('380')) {
    digits = digits.slice(3);
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 9);
}

export function formatPhone(digits: string): string {
  if (!digits) {
    return '';
  }
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return `+380 ${parts.join(' ')}`;
}

export function toApiPhone(digits: string): string {
  return `+380${digits}`;
}

export function conflictField(error: unknown): 'email' | 'phone' | null {
  if (!(error instanceof ApiError) || error.status !== 409) {
    return null;
  }
  const detail = (error.body as { detail?: unknown } | null)?.detail;
  if (typeof detail !== 'string') {
    return null;
  }
  if (detail.includes('email')) {
    return 'email';
  }
  if (detail.includes('phone')) {
    return 'phone';
  }
  return null;
}

const API_FIELDS: Record<string, keyof SignUpValues> = {
  first_name: 'firstName',
  last_name: 'lastName',
  phone: 'phone',
  email: 'email',
  address: 'address',
  password: 'password',
};

export function invalidFields(error: unknown): (keyof SignUpValues)[] | null {
  if (!(error instanceof ApiError) || error.status !== 422) {
    return null;
  }
  const detail = (error.body as { detail?: unknown } | null)?.detail;
  if (!Array.isArray(detail)) {
    return [];
  }
  const fields = new Set<keyof SignUpValues>();
  for (const item of detail) {
    const loc = (item as { loc?: unknown } | null)?.loc;
    if (Array.isArray(loc)) {
      const field = API_FIELDS[String(loc[loc.length - 1])];
      if (field) {
        fields.add(field);
      }
    }
  }
  return [...fields];
}