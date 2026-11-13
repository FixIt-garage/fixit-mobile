import { ApiError } from '../../api/client';
import { conflictField, formatPhone, phoneDigits, signUpSchema, toApiPhone } from './signUpForm';

describe('phone mask', () => {
  it('keeps only 9 digits after +380', () => {
    expect(phoneDigits('671234567')).toBe('671234567');
    expect(phoneDigits('0671234567')).toBe('671234567');
    expect(phoneDigits('+380 67 123 45 67')).toBe('671234567');
    expect(phoneDigits('6712345678999')).toBe('671234567');
  });

  it('formats digits for display', () => {
    expect(formatPhone('')).toBe('');
    expect(formatPhone('67')).toBe('+380 67');
    expect(formatPhone('6712')).toBe('+380 67 12');
    expect(formatPhone('671234567')).toBe('+380 67 123 45 67');
  });

  it('builds the API phone', () => {
    expect(toApiPhone('671234567')).toBe('+380671234567');
  });
});

describe('signUpSchema', () => {
  const valid = {
    firstName: 'Анна',
    lastName: 'Шеремета',
    phone: '671234567',
    email: 'anna@gmail.com',
    address: 'Львів, Городоцька, 15',
    password: 'password1',
  };

  it('accepts a valid form', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a short password and a bad email', () => {
    const result = signUpSchema.safeParse({ ...valid, password: 'short', email: 'anna' });
    expect(result.success).toBe(false);
  });
});

describe('conflictField', () => {
  it('detects email and phone conflicts', () => {
    expect(
      conflictField(new ApiError(409, { detail: 'A user with this email already exists' })),
    ).toBe('email');
    expect(
      conflictField(new ApiError(409, { detail: 'A user with this phone already exists' })),
    ).toBe('phone');
  });

  it('ignores other errors', () => {
    expect(conflictField(new ApiError(500, null))).toBeNull();
    expect(conflictField(new Error('offline'))).toBeNull();
  });
});