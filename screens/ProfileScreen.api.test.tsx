import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import * as client from '../api/client';
import ProfileScreen from './ProfileScreen';

jest.mock('../api/client', () => ({
  ...jest.requireActual('../api/client'),
  apiGet: jest.fn(),
}));

jest.mock('../src/auth/AuthProvider', () => ({
  useAuth: () => ({ signOut: jest.fn() }),
}));

const apiGet = jest.mocked(client.apiGet);

const MASTER_ME = {
  id: 1,
  public_id: 247,
  email: 'oleksandr.koval@gmail.com',
  first_name: 'Олександр',
  last_name: 'Коваль',
  phone: '+380671234567',
  address: 'Львів, вул. Наукова, 7',
  city: 'Львів',
  avatar_url: null,
  role: 'master',
  stats: { requests_count: 0, reviews_count: 32, member_since_year: 2026 },
};

function renderWithQuery(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ProfileScreen with the real API hooks', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('keeps the master profile when the master API returns 404', async () => {
    apiGet.mockImplementation((async (path: string) => {
      if (path === '/users/me') {
        return MASTER_ME;
      }
      throw new client.ApiError(404, { detail: 'Not Found' });
    }) as typeof client.apiGet);

    await renderWithQuery(<ProfileScreen />);

    expect(await screen.findByText('Олександр Коваль')).toBeTruthy();
    expect(screen.getByText('Майстер · Львів · ID 0247')).toBeTruthy();
    expect(screen.getByText('32')).toBeTruthy();
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(screen.getByText('oleksandr.koval@gmail.com')).toBeTruthy();
    expect(screen.queryByText('Не вдалося завантажити профіль')).toBeNull();
    expect(screen.queryByText('Я волонтер')).toBeNull();
    expect(apiGet).toHaveBeenCalledWith('/masters/1');
  });

  it('shows the error state when /users/me fails', async () => {
    apiGet.mockRejectedValue(new client.ApiError(500, null));

    await renderWithQuery(<ProfileScreen />);

    expect(await screen.findByText('Не вдалося завантажити профіль')).toBeTruthy();
  });
});