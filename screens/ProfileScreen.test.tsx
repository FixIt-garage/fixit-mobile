import { fireEvent, render, screen } from '@testing-library/react-native';
import { MOCK_PROFILE } from '../src/api/profile';
import { MOCK_MASTER_PROFILE } from '../src/api/masterProfile';
import ProfileScreen from './ProfileScreen';

const mockSignOut = jest.fn();
const mockRefetch = jest.fn();
const mockSetVolunteer = jest.fn();

type MockQuery = { data?: unknown; isPending: boolean; isError: boolean; refetch: jest.Mock };
let mockProfileQuery: MockQuery;
let mockMasterQuery: MockQuery;

jest.mock('../src/auth/AuthProvider', () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

jest.mock('../src/api/profile', () => ({
  ...jest.requireActual('../src/api/profile'),
  useMyProfile: () => mockProfileQuery,
}));

jest.mock('../src/api/masterProfile', () => ({
  ...jest.requireActual('../src/api/masterProfile'),
  useMyMasterProfile: () => mockMasterQuery,
  useSetVolunteer: () => ({ mutate: mockSetVolunteer }),
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileQuery = { data: MOCK_PROFILE, isPending: false, isError: false, refetch: mockRefetch };
    mockMasterQuery = { isPending: true, isError: false, refetch: jest.fn() };
  });

  it('shows the client profile', async () => {
    await render(<ProfileScreen />);

    expect(screen.getByText('Олександр Коваль')).toBeTruthy();
    expect(screen.getByText('Клієнт · Львів · ID 3120')).toBeTruthy();
    expect(screen.getByText('З нами з')).toBeTruthy();
    expect(screen.getByText('75%')).toBeTruthy();
    expect(screen.getByText('+380 67 123 45 67')).toBeTruthy();
    expect(screen.queryByText('Я волонтер')).toBeNull();
  });

  it('shows the master profile with rating, experience and volunteer card', async () => {
    mockProfileQuery = {
      ...mockProfileQuery,
      data: { ...MOCK_PROFILE, role: 'master', publicId: 247 },
    };
    mockMasterQuery = {
      data: MOCK_MASTER_PROFILE,
      isPending: false,
      isError: false,
      refetch: jest.fn(),
    };
    await render(<ProfileScreen />);

    expect(screen.getByText('Майстер · Львів · ID 0247')).toBeTruthy();
    expect(screen.getByLabelText('Рейтинг 4,8')).toBeTruthy();
    expect(screen.getByText('7 р.')).toBeTruthy();
    expect(screen.getByText('40%')).toBeTruthy();
    expect(
      screen.getByText('Додайте послуги й місто — і клієнти знайдуть вас у пошуку.'),
    ).toBeTruthy();
    expect(screen.getByText('Я волонтер')).toBeTruthy();
  });

  it('shows a loader while the master data loads', async () => {
    mockProfileQuery = {
      ...mockProfileQuery,
      data: { ...MOCK_PROFILE, role: 'master' },
    };
    await render(<ProfileScreen />);

    expect(screen.getByLabelText('Завантаження профілю')).toBeTruthy();
  });

  it('logs out', async () => {
    await render(<ProfileScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Вийти' }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('shows a loader while loading', async () => {
    mockProfileQuery = { isPending: true, isError: false, refetch: mockRefetch };
    await render(<ProfileScreen />);

    expect(screen.getByLabelText('Завантаження профілю')).toBeTruthy();
  });

  it('lets retry and log out on error', async () => {
    mockProfileQuery = { isPending: false, isError: true, refetch: mockRefetch };
    await render(<ProfileScreen />);

    await fireEvent.press(screen.getByText('Спробувати ще раз'));
    expect(mockRefetch).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByText('Вийти'));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});