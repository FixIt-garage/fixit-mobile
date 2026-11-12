import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import { withMock } from './mock';

type CategoryResponse = {
  id: number;
  name: string;
  slug: string | null;
  name_uk: string | null;
  parent_id: number | null;
  sort_order: number;
};

export type Category = {
  id: number;
  name: string;
  parentId: number | null;
};

function toCategory(response: CategoryResponse): Category {
  return {
    id: response.id,
    name: response.name_uk ?? response.name,
    parentId: response.parent_id,
  };
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Побутова техніка', parentId: null },
  { id: 2, name: 'Електроніка', parentId: null },
  { id: 3, name: 'Сантехніка', parentId: null },
  { id: 4, name: 'Пральні машини', parentId: 1 },
];

export async function fetchCategories(): Promise<Category[]> {
  return withMock(
    async () => (await apiGet<CategoryResponse[]>('/categories')).map(toCategory),
    () => MOCK_CATEGORIES,
  );
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
}