import { z } from 'zod';
import type { MasterProfile, MasterProfilePatch } from './api/masterProfile';

export const NAME_PART_MAX = 100;
export const SCHEDULE_MAX = 255;

export function parseLocation(text: string): { city: string | null; district: string | null } {
  const [cityPart, ...rest] = text.split(',');
  const city = cityPart.trim();
  const district = rest.join(',').trim();
  return { city: city || null, district: district || null };
}

export function formatLocation(city: string | null, district: string | null): string {
  if (city && district) {
    return `${city}, ${district}`;
  }
  if (district) {
    return `, ${district}`;
  }
  return city ?? '';
}

function parseNumber(text: string): number | null {
  const trimmed = text.trim();
  return trimmed ? Number(trimmed.replace(',', '.')) : null;
}

export const masterProfileSchema = z.object({
  categoryIds: z.array(z.string()),
  location: z
    .string()
    .trim()
    .refine((value) => {
      const { city, district } = parseLocation(value);
      return (city ?? '').length <= NAME_PART_MAX && (district ?? '').length <= NAME_PART_MAX;
    }, `Місто і район не довші за ${NAME_PART_MAX} символів`),
  experience: z
    .string()
    .trim()
    .refine((value) => value === '' || (/^\d{1,2}$/.test(value) && Number(value) <= 60), 'Від 0 до 60 років'),
  price: z
    .string()
    .trim()
    .refine((value) => value === '' || /^\d{1,8}([.,]\d{1,2})?$/.test(value), 'Вкажіть суму числом, наприклад 300'),
  schedule: z.string().trim().max(SCHEDULE_MAX, `Не більше ${SCHEDULE_MAX} символів`),
});

export type MasterProfileValues = z.infer<typeof masterProfileSchema>;

export function toFormValues(master: MasterProfile): MasterProfileValues {
  return {
    categoryIds: master.categoryIds.map(String),
    location: formatLocation(master.city, master.district),
    experience: master.experienceYears !== null ? String(master.experienceYears) : '',
    price: master.callOutPrice !== null ? String(master.callOutPrice).replace('.', ',') : '',
    schedule: master.schedule ?? '',
  };
}

function sameIds(a: readonly number[], b: readonly number[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((value, index) => value === sortedB[index]);
}

export function buildPatch(values: MasterProfileValues, master: MasterProfile): MasterProfilePatch {
  const patch: MasterProfilePatch = {};

  const categoryIds = values.categoryIds.map(Number);
  if (!sameIds(categoryIds, master.categoryIds)) {
    patch.category_ids = categoryIds;
  }

  const { city, district } = parseLocation(values.location);
  if (city !== master.city) {
    patch.city = city;
  }
  if (district !== master.district) {
    patch.district = district;
  }

  const experience = parseNumber(values.experience);
  if (experience !== master.experienceYears) {
    patch.experience_years = experience;
  }

  const price = parseNumber(values.price);
  if (price !== master.callOutPrice) {
    patch.call_out_price = price;
  }

  const schedule = values.schedule.trim() || null;
  if (schedule !== master.schedule) {
    patch.schedule = schedule;
  }

  return patch;
}