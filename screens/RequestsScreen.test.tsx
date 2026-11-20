import type { PropsWithChildren } from 'react';
import { useNavigation } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RequestsScreen from './RequestsScreen';
import { fetchIssues, type Issue } from '../src/api/issues';
import { useCategories } from '../src/api/categories';
import { ThemeProvider } from '../src/theme';

jest.mock('../src/api/issues', () => ({
  fetchIssues: jest.fn(),
}));

jest.mock('../src/api/categories', () => ({
  useCategories: jest.fn(),
}));

jest.mock('../src/api/mock', () => ({
  isMockMode: () => false,
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

const mockedFetchIssues = jest.mocked(fetchIssues);
const mockedUseCategories = jest.mocked(useCategories);
const mockedUseNavigation = jest.mocked(useNavigation);

const mockNavigate = jest.fn();

const mockIssues: Issue[] = [
  {
    id: 1,
    title: 'Пральна машина не зливає воду',
    description: '',
    category_id: 1,
    address: null,
    district: null,
    status: 'done',
    owner_id: 1,
    assignee_master_id: null,
    assignee_company_id: null,
    created_at: '2026-10-21T10:00:00Z',
    updated_at: '2026-10-21T10:00:00Z',
  },
  {
    id: 2,
    title: 'Не працюють розетки на кухні',
    description: '',
    category_id: 2,
    address: null,
    district: null,
    status: 'in_progress',
    owner_id: 1,
    assignee_master_id: null,
    assignee_company_id: null,
    created_at: '2026-10-22T10:00:00Z',
    updated_at: '2026-10-22T10:00:00Z',
  },
  {
    id: 3,
    title: 'Тече змішувач у ванній',
    description: '',
    category_id: 3,
    address: null,
    district: null,
    status: 'accepted',
    owner_id: 1,
    assignee_master_id: null,
    assignee_company_id: null,
    created_at: '2026-10-23T10:00:00Z',
    updated_at: '2026-10-23T10:00:00Z',
  },
  {
    id: 4,
    title: 'Розбитий екран iPhone 13',
    description: '',
    category_id: 4,
    address: null,
    district: null,
    status: 'sent',
    owner_id: 1,
    assignee_master_id: null,
    assignee_company_id: null,
    created_at: '2026-11-14T10:00:00Z',
    updated_at: '2026-11-14T10:00:00Z',
  },
];

const mockCounts = {
  all: 4,
  active: 3,
  done: 1,
};

function Wrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, right: 0, bottom: 0, left: 0 },
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

describe('RequestsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseNavigation.mockReturnValue({
      navigate: mockNavigate,
    } as never);

    mockedUseCategories.mockReturnValue({
      data: [
        { id: 1, name: 'Побутова техніка', parentId: null },
        { id: 2, name: 'Електроніка', parentId: null },
        { id: 3, name: 'Сантехніка', parentId: null },
        { id: 4, name: 'Телефони', parentId: null },
      ],
    } as ReturnType<typeof useCategories>);

    mockedFetchIssues.mockImplementation(async (params = {}) => {
      let items = mockIssues;

      if (params.statusGroup === 'active') {
        items = mockIssues.filter((issue) =>
          ['sent', 'accepted', 'in_progress'].includes(issue.status),
        );
      }

      if (params.statusGroup === 'done') {
        items = mockIssues.filter((issue) => issue.status === 'done');
      }

      const offset = params.offset ?? 0;
      const limit = params.limit ?? 20;

      return {
        items: items.slice(offset, offset + limit),
        counts: mockCounts,
      };
    });
  });

  it('renders requests and filters with server counts', async () => {
    await render(<RequestsScreen />, { wrapper: Wrapper });

    expect(await screen.findByText('Мої заявки')).toBeTruthy();

    expect(screen.getByText('Усі · 4')).toBeTruthy();
    expect(screen.getByText('Активні · 3')).toBeTruthy();
    expect(screen.getByText('Виконані · 1')).toBeTruthy();

    expect(
      await screen.findByText('Пральна машина не зливає воду'),
    ).toBeTruthy();

    expect(screen.getByText('Не працюють розетки на кухні')).toBeTruthy();
    expect(screen.getByText('Тече змішувач у ванній')).toBeTruthy();
    expect(screen.getByText('Розбитий екран iPhone 13')).toBeTruthy();
  });

  it('shows only active requests when active filter is selected', async () => {
    await render(<RequestsScreen />, { wrapper: Wrapper });

    expect(
      await screen.findByText('Пральна машина не зливає воду'),
    ).toBeTruthy();

    fireEvent.press(screen.getByText('Активні · 3'));

    await waitFor(() => {
      expect(screen.queryByText('Пральна машина не зливає воду')).toBeNull();
    });

    expect(screen.getByText('Не працюють розетки на кухні')).toBeTruthy();
    expect(screen.getByText('Тече змішувач у ванній')).toBeTruthy();
    expect(screen.getByText('Розбитий екран iPhone 13')).toBeTruthy();

    expect(mockedFetchIssues).toHaveBeenLastCalledWith(
      expect.objectContaining({
        statusGroup: 'active',
      }),
    );
  });

  it('shows only completed requests when done filter is selected', async () => {
    await render(<RequestsScreen />, { wrapper: Wrapper });

    expect(
      await screen.findByText('Не працюють розетки на кухні'),
    ).toBeTruthy();

    fireEvent.press(screen.getByText('Виконані · 1'));

    expect(
      await screen.findByText('Пральна машина не зливає воду'),
    ).toBeTruthy();

    expect(screen.queryByText('Не працюють розетки на кухні')).toBeNull();

    expect(screen.queryByText('Тече змішувач у ванній')).toBeNull();

    expect(mockedFetchIssues).toHaveBeenLastCalledWith(
      expect.objectContaining({
        statusGroup: 'done',
      }),
    );
  });

  it('navigates to request details when a request card is pressed', async () => {
    await render(<RequestsScreen />, { wrapper: Wrapper });

    const requestCard = await screen.findByRole('button', {
      name: /Не працюють розетки на кухні/,
    });

    fireEvent.press(requestCard);

    expect(mockNavigate).toHaveBeenCalledWith('RequestDetails', {
      issueId: 2,
      title: 'Не працюють розетки на кухні',
    });
  });

    it('shows empty state when there are no requests', async () => {
    mockedFetchIssues.mockResolvedValue({
      items: [],
      counts: {
        all: 0,
        active: 0,
        done: 0,
      },
    });

    await render(<RequestsScreen />, { wrapper: Wrapper });

    expect(await screen.findByText('Поки що заявок немає')).toBeTruthy();

    expect(screen.getByText('Створити заявку')).toBeTruthy();
  });

  it('navigates to home tab when create request button is pressed', async () => {
    mockedFetchIssues.mockResolvedValue({
      items: [],
      counts: {
        all: 0,
        active: 0,
        done: 0,
      },
    });

    await render(<RequestsScreen />, { wrapper: Wrapper });

    fireEvent.press(await screen.findByText('Створити заявку'));

    expect(mockNavigate).toHaveBeenCalledWith('home');
  });
});
