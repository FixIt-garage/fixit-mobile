import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SearchResultsScreen, { formatFound } from './SearchResultsScreen';
import { useCategories } from '../src/api/categories';
import {
  MOCK_MASTER_RESULTS,
  MOCK_SERVICE_CENTER_RESULTS,
  useSearchMasters,
  useSearchServiceCenters,
} from '../src/api/search';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('../src/api/categories', () => ({
  ...jest.requireActual('../src/api/categories'),
  useCategories: jest.fn(),
}));

jest.mock('../src/api/search', () => ({
  ...jest.requireActual('../src/api/search'),
  useSearchMasters: jest.fn(),
  useSearchServiceCenters: jest.fn(),
}));

const mockedUseCategories = jest.mocked(useCategories);
const mockedUseSearchMasters = jest.mocked(useSearchMasters);
const mockedUseSearchServiceCenters = jest.mocked(useSearchServiceCenters);

const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const navigate = jest.fn();

function queryResult(overrides: Record<string, unknown> = {}) {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    isRefetching: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    isFetchNextPageError: false,
    fetchNextPage: jest.fn(),
    refetch: jest.fn(),
    ...overrides,
  };
}

function mockMasters(overrides: Record<string, unknown>) {
  mockedUseSearchMasters.mockReturnValue(
    queryResult(overrides) as unknown as ReturnType<typeof useSearchMasters>,
  );
}

function mockServices(overrides: Record<string, unknown>) {
  mockedUseSearchServiceCenters.mockReturnValue(
    queryResult(overrides) as unknown as ReturnType<typeof useSearchServiceCenters>,
  );
}

async function renderScreen() {
  await render(
    <SafeAreaProvider initialMetrics={METRICS}>
      <SearchResultsScreen
        navigation={{ navigate } as never}
        route={
          {
            key: 'SearchResults',
            name: 'SearchResults',
            params: { city: 'Львів', categoryId: 1, description: 'Не крутить барабан' },
          } as never
        }
      />
    </SafeAreaProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseCategories.mockReturnValue({
    data: [{ id: 1, name: 'Побутова техніка', parentId: null }],
  } as unknown as ReturnType<typeof useCategories>);
  mockMasters({ data: { pages: [MOCK_MASTER_RESULTS] } });
  mockServices({ data: { pages: [MOCK_SERVICE_CENTER_RESULTS] } });
});

describe('formatFound', () => {
  it('uses Ukrainian plural forms', () => {
    expect(formatFound('masters', 1)).toBe('Знайдено 1 майстра');
    expect(formatFound('masters', 3)).toBe('Знайдено 3 майстри');
    expect(formatFound('masters', 12)).toBe('Знайдено 12 майстрів');
    expect(formatFound('services', 21)).toBe('Знайдено 21 сервіс');
    expect(formatFound('services', 5)).toBe('Знайдено 5 сервісів');
  });
});

describe('SearchResultsScreen', () => {
  it('shows the request, city with category and found masters', async () => {
    await renderScreen();

    expect(screen.getByText('Не крутить барабан')).toBeTruthy();
    expect(screen.getByText('Львів · Побутова техніка')).toBeTruthy();
    expect(screen.getByText('Знайдено 3 майстри')).toBeTruthy();
    expect(screen.getByText('За рейтингом')).toBeTruthy();
    expect(screen.getByText('Андрій Мельник')).toBeTruthy();
  });

  it('searches by city and category and only loads the active tab', async () => {
    await renderScreen();

    expect(mockedUseSearchMasters).toHaveBeenLastCalledWith(
      { city: 'Львів', categoryId: 1 },
      true,
    );
    expect(mockedUseSearchServiceCenters).toHaveBeenLastCalledWith(
      { city: 'Львів', categoryId: 1 },
      false,
    );
  });

  it('opens the master profile', async () => {
    await renderScreen();

    await fireEvent.press(screen.getByText('Андрій Мельник'));

    expect(navigate).toHaveBeenCalledWith('MasterProfile', {
      masterId: 12,
      draft: { categoryId: 1, description: 'Не крутить барабан' },
    });
  });

  it('switches to service centers', async () => {
    await renderScreen();

    await fireEvent.press(screen.getByText('Сервіси'));

    expect(screen.getByText('Знайдено 2 сервіси')).toBeTruthy();
    expect(screen.getByText('ТехноСервіс')).toBeTruthy();
    expect(screen.getByText('Відчинено до 19:00')).toBeTruthy();
    expect(screen.getByText('Зачинено')).toBeTruthy();
    expect(mockedUseSearchServiceCenters).toHaveBeenLastCalledWith(
      { city: 'Львів', categoryId: 1 },
      true,
    );
  });

  it('shows skeleton cards while loading', async () => {
    mockMasters({ isLoading: true });

    await renderScreen();

    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(4);
    expect(screen.getByText('Шукаємо майстрів поруч…')).toBeTruthy();
    expect(screen.queryByText(/Знайдено/)).toBeNull();
  });

  it('shows the empty state', async () => {
    mockMasters({ data: { pages: [{ items: [], total: 0 }] } });

    await renderScreen();

    expect(screen.getByText('Нікого не знайшли')).toBeTruthy();
  });

  it('retries after an error', async () => {
    const refetch = jest.fn();
    mockMasters({ isError: true, refetch });

    await renderScreen();
    await fireEvent.press(screen.getByText('Спробувати ще раз'));

    expect(refetch).toHaveBeenCalled();
  });

  it('keeps loaded cards when the next page fails', async () => {
    const fetchNextPage = jest.fn();
    const refetch = jest.fn();
    mockMasters({
      data: { pages: [MOCK_MASTER_RESULTS] },
      isError: true,
      isFetchNextPageError: true,
      hasNextPage: true,
      fetchNextPage,
      refetch,
    });

    await renderScreen();

    expect(screen.getByText('Андрій Мельник')).toBeTruthy();
    expect(screen.getByText('Знайдено 3 майстри')).toBeTruthy();
    expect(screen.queryByText('Не вдалося завантажити результати.')).toBeNull();
    expect(screen.getByText('Не вдалося завантажити ще')).toBeTruthy();

    await fireEvent.press(screen.getByText('Спробувати ще раз'));

    expect(fetchNextPage).toHaveBeenCalled();
    expect(refetch).not.toHaveBeenCalled();
  });

  it('keeps loaded cards when a refresh fails', async () => {
    mockMasters({ data: { pages: [MOCK_MASTER_RESULTS] }, isError: true });

    await renderScreen();

    expect(screen.getByText('Андрій Мельник')).toBeTruthy();
    expect(screen.queryByText('Не вдалося завантажити результати.')).toBeNull();
  });
});