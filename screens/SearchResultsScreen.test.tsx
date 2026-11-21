import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  MOCK_SERVICE_CENTER,
  type ServiceCenterSearchResult,
} from '../src/api/serviceCenters';
import SearchResultsScreen from './SearchResultsScreen';

type MockQuery = {
  data?: ServiceCenterSearchResult;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  refetch: jest.Mock;
};

let mockSearchQuery: MockQuery;

jest.mock('../src/api/serviceCenters', () => ({
  ...jest.requireActual('../src/api/serviceCenters'),
  useServiceCenters: () => mockSearchQuery,
}));

type Props = ComponentProps<typeof SearchResultsScreen>;

const navigation = {
  navigate: jest.fn(),
} as unknown as Props['navigation'];

const route = {
  key: 'SearchResults',
  name: 'SearchResults',
  params: {
    city: 'Львів',
    categoryId: 1,
    description: 'Ремонт смартфона',
  },
} as Props['route'];

async function renderScreen() {
  await render(
    <SearchResultsScreen
      navigation={navigation}
      route={route}
    />,
  );
}

describe('SearchResultsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSearchQuery = {
      data: {
        items: [MOCK_SERVICE_CENTER],
        total: 1,
      },
      isLoading: false,
      isError: false,
      isRefetching: false,
      refetch: jest.fn(),
    };
  });

  it('renders service center search results', async () => {
    await renderScreen();

    expect(screen.getByText('Сервісні центри')).toBeTruthy();
    expect(screen.getByText('Львів · Ремонт смартфона')).toBeTruthy();
    expect(screen.getByText('Знайдено: 1')).toBeTruthy();
    expect(screen.getByText('ТехноСервіс')).toBeTruthy();
    expect(screen.getByText('вул. Наукова, 7А, Львів')).toBeTruthy();
    expect(screen.getByText('Відчинено до 19:00')).toBeTruthy();
  });

  it('opens the service center profile using its public ID', async () => {
    await renderScreen();

    await fireEvent.press(
      screen.getByRole('button', { name: /ТехноСервіс/ }),
    );

    expect(navigation.navigate).toHaveBeenCalledWith(
      'ServiceCenterProfile',
      { serviceCenterId: 1182 },
    );
  });

  it('shows a loader while search results are loading', async () => {
    mockSearchQuery = {
      isLoading: true,
      isError: false,
      isRefetching: false,
      refetch: jest.fn(),
    };

    await renderScreen();

    expect(
      screen.getByLabelText('Завантаження сервісних центрів'),
    ).toBeTruthy();
    expect(screen.queryByText('ТехноСервіс')).toBeNull();
  });

  it('shows an empty state when no service centers are found', async () => {
    mockSearchQuery = {
      data: { items: [], total: 0 },
      isLoading: false,
      isError: false,
      isRefetching: false,
      refetch: jest.fn(),
    };

    await renderScreen();

    expect(
      screen.getByText('Сервісних центрів не знайдено'),
    ).toBeTruthy();
  });

  it('shows an error and retries the search', async () => {
    const refetch = jest.fn();

    mockSearchQuery = {
      isLoading: false,
      isError: true,
      isRefetching: false,
      refetch,
    };

    await renderScreen();

    expect(
      screen.getByText('Не вдалося завантажити результати'),
    ).toBeTruthy();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Спробувати ще раз' }),
    );

    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
