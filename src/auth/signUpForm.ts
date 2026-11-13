import { z } from 'zod';
import { ApiError } from '../../api/client';

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, 'Вкажіть імʼя'),
  lastName: z.string().trim().min(1, 'Вкажіть прізвище'),
  phone: z.string().regex(/^\d{9}$/, 'Введіть номер повністю'),
  email: z.string().trim().min(1, 'Вкажіть пошту').email('Перевірте адресу пошти'),
  address: z.string().trim().min(1, 'Вкажіть адресу'),
  password: z.string().min(8, 'Щонайменше 8 символів'),
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