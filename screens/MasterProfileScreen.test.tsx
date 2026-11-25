import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ApiError } from '../api/client';
import { MOCK_MASTER_PUBLIC, MOCK_REVIEWS } from '../src/api/masterPublic';
import MasterProfileScreen, { MasterProfileView } from './MasterProfileScreen';

type MockQuery = {
  data?: unknown;
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  refetch: jest.Mock;
};
let mockMasterQuery: MockQuery;
let mockReviewsQuery: MockQuery;
const mockReviewsRefetch = jest.fn();

jest.mock('../src/api/issueCreate', () => ({
  useCreateIssue: () => ({ mutate: jest.fn(), isPending: false, isError: false }),
}));

jest.mock('../src/api/masterPublic', () => ({
  ...jest.requireActual('../src/api/masterPublic'),
  useMasterPublic: () => mockMasterQuery,
  useMasterReviews: () => mockReviewsQuery,
}));

type Props = ComponentProps<typeof MasterProfileScreen>;
const navigation = { goBack: jest.fn() } as unknown as Props['navigation'];
const route = { key: 'MasterProfile', name: 'MasterProfile', params: { masterId: 12 } } as Props['route'];

async function renderScreen() {
  await render(<MasterProfileScreen navigation={navigation} route={route} />);
}

describe('MasterProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMasterQuery = { data: MOCK_MASTER_PUBLIC, isPending: false, isError: false, refetch: jest.fn() };
    mockReviewsQuery = { data: MOCK_REVIEWS, isPending: false, isError: false, refetch: mockReviewsRefetch };
  });

  it('renders the master profile', async () => {
    await renderScreen();

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
  });

  it('hides actions that are not wired yet', async () => {
    await renderScreen();

    expect(screen.queryByText('Надіслати заявку')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Усі відгуки' })).toBeNull();
  });

  it('shows a loader while reviews load, not the empty state', async () => {
    mockReviewsQuery = { isPending: true, isError: false, refetch: mockReviewsRefetch };
    await renderScreen();

    expect(screen.getByLabelText('Завантаження відгуків')).toBeTruthy();
    expect(screen.queryByText('Поки що відгуків немає')).toBeNull();
    expect(screen.getByText('Андрій Мельник')).toBeTruthy();
  });

  it('shows a reviews error with retry and keeps the profile', async () => {
    mockReviewsQuery = { isPending: false, isError: true, refetch: mockReviewsRefetch };
    await renderScreen();

    expect(screen.getByText('Не вдалося завантажити відгуки')).toBeTruthy();
    expect(screen.queryByText('Поки що відгуків немає')).toBeNull();
    expect(screen.getByText('Андрій Мельник')).toBeTruthy();

    await fireEvent.press(screen.getByText('Спробувати ще раз'));

    expect(mockReviewsRefetch).toHaveBeenCalledTimes(1);
  });

  it('shows the empty reviews state', async () => {
    mockReviewsQuery = { data: { items: [], total: 0 }, isPending: false, isError: false, refetch: mockReviewsRefetch };
    await renderScreen();

    expect(screen.getByText('Поки що відгуків немає')).toBeTruthy();
  });

  it('shows not found for 404', async () => {
    mockMasterQuery = {
      isPending: false,
      isError: true,
      error: new ApiError(404, { detail: 'Master not found' }),
      refetch: jest.fn(),
    };
    await renderScreen();

    expect(screen.getByText('Майстра не знайдено')).toBeTruthy();
    expect(screen.queryByText('Спробувати ще раз')).toBeNull();
  });

  it('goes back', async () => {
    await renderScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Назад' }));

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });
});

describe('MasterProfileView', () => {
  it('shows and calls the actions when they are provided', async () => {
    const onSendRequest = jest.fn();
    const onAllReviews = jest.fn();
    await render(
      <MasterProfileView
        master={MOCK_MASTER_PUBLIC}
        reviews={MOCK_REVIEWS.items}
        reviewsTotal={32}
        reviewsState="ready"
        onRetryReviews={jest.fn()}
        onBack={jest.fn()}
        onSendRequest={onSendRequest}
        onAllReviews={onAllReviews}
      />,
    );

    await fireEvent.press(screen.getByText('Надіслати заявку'));
    await fireEvent.press(screen.getByRole('button', { name: 'Усі відгуки' }));

    expect(onSendRequest).toHaveBeenCalledTimes(1);
    expect(onAllReviews).toHaveBeenCalledTimes(1);
  });
});