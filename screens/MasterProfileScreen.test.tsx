import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ApiError } from '../api/client';
import { MOCK_MASTER_PUBLIC, MOCK_REVIEWS } from '../src/api/masterPublic';
import MasterProfileScreen, { MasterProfileView } from './MasterProfileScreen';

type MockQuery = { data?: unknown; isPending: boolean; isError: boolean; error?: unknown; refetch: jest.Mock };
let mockMasterQuery: MockQuery;
let mockReviewsQuery: MockQuery;

jest.mock('../src/api/masterPublic', () => ({
  ...jest.requireActual('../src/api/masterPublic'),
  useMasterPublic: () => mockMasterQuery,
  useMasterReviews: () => mockReviewsQuery,
}));

type Props = ComponentProps<typeof MasterProfileScreen>;
const navigation = { goBack: jest.fn() } as unknown as Props['navigation'];
const route = { key: 'MasterProfile', name: 'MasterProfile', params: { masterId: 12 } } as Props['route'];

describe('MasterProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMasterQuery = { data: MOCK_MASTER_PUBLIC, isPending: false, isError: false, refetch: jest.fn() };
    mockReviewsQuery = { data: MOCK_REVIEWS, isPending: false, isError: false, refetch: jest.fn() };
  });

  it('renders the master profile', async () => {
    await render(<MasterProfileScreen navigation={navigation} route={route} />);

    expect(screen.getByRole('header', { name: 'Андрій Мельник' })).toBeTruthy();
    expect(screen.getByText('Майстер · ID 0247')).toBeTruthy();
    expect(screen.getByText('Побутова техніка · Електрика')).toBeTruthy();
    expect(screen.getByLabelText('Волонтер')).toBeTruthy();
    expect(screen.getByLabelText('Рейтинг 4,8')).toBeTruthy();
    expect(screen.getByText('7 р.')).toBeTruthy();
    expect(screen.getByText('Львів, Сихівський район')).toBeTruthy();
    expect(screen.getByText('Пн–Сб, 9:00–19:00')).toBeTruthy();
    expect(screen.getByText('Виклик — від 300 ₴')).toBeTruthy();
    expect(screen.getByText('Відгуки · 32')).toBeTruthy();
    expect(screen.getByText('Ірина')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Усі відгуки' })).toBeTruthy();
  });

  it('shows the empty reviews state', async () => {
    mockReviewsQuery = { data: { items: [], total: 0 }, isPending: false, isError: false, refetch: jest.fn() };
    await render(<MasterProfileScreen navigation={navigation} route={route} />);

    expect(screen.getByText('Поки що відгуків немає')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Усі відгуки' })).toBeNull();
  });

  it('shows not found for 404', async () => {
    mockMasterQuery = {
      isPending: false,
      isError: true,
      error: new ApiError(404, { detail: 'Master not found' }),
      refetch: jest.fn(),
    };
    await render(<MasterProfileScreen navigation={navigation} route={route} />);

    expect(screen.getByText('Майстра не знайдено')).toBeTruthy();
    expect(screen.queryByText('Спробувати ще раз')).toBeNull();
  });

  it('goes back', async () => {
    await render(<MasterProfileScreen navigation={navigation} route={route} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Назад' }));

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });
});

describe('MasterProfileView', () => {
  it('calls the send request action', async () => {
    const onSendRequest = jest.fn();
    await render(
      <MasterProfileView
        master={MOCK_MASTER_PUBLIC}
        reviews={MOCK_REVIEWS.items}
        reviewsTotal={32}
        onBack={jest.fn()}
        onSendRequest={onSendRequest}
        onAllReviews={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByText('Надіслати заявку'));

    expect(onSendRequest).toHaveBeenCalledTimes(1);
  });
});