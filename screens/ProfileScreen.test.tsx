import { fireEvent, render, screen } from '@testing-library/react-native';
import { MOCK_PROFILE } from '../src/api/profile';
import ProfileScreen from './ProfileScreen';

const mockSignOut = jest.fn();
const mockRefetch = jest.fn();
let mockQuery: { data?: unknown; isPending: boolean; isError: boolean; refetch: jest.Mock };

jest.mock('../src/auth/AuthProvider', () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

jest.mock('../src/api/profile', () => ({
  ...jest.requireActual('../src/api/profile'),
  useMyProfile: () => mockQuery,
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = { data: MOCK_PROFILE, isPending: false, isError: false, refetch: mockRefetch };
  });

  it('shows the client profile', async () => {
    await render(<ProfileScreen />);

    expect(screen.getByText('Олександр Коваль')).toBeTruthy();
    expect(screen.getByText('Клієнт · Львів · ID 3120')).toBeTruthy();
    expect(screen.getByText('З нами з')).toBeTruthy();
    expect(screen.getByText('75%')).toBeTruthy();
    expect(screen.getByText('+380 67 123 45 67')).toBeTruthy();
  });

  it('logs out', async () => {
    await render(<ProfileScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Вийти' }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('shows a loader while loading', async () => {
    mockQuery = { isPending: true, isError: false, refetch: mockRefetch };
    await render(<ProfileScreen />);

    expect(screen.getByLabelText('Завантаження профілю')).toBeTruthy();
  });

  it('lets retry and log out on error', async () => {
    mockQuery = { isPending: false, isError: true, refetch: mockRefetch };
    await render(<ProfileScreen />);

    await fireEvent.press(screen.getByText('Спробувати ще раз'));
    expect(mockRefetch).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByText('Вийти'));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});