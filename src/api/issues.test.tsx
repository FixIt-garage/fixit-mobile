import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import * as client from '../../api/client';
import {
  createIssue,
  fetchIssueDetails,
  fetchIssues,
  MOCK_ISSUES,
  MOCK_ISSUE_DETAILS,
  useIssues,
  type IssueDetail,
  type IssueListResponse,
  type CreateIssueInput,
} from './issues';
import { setMockMode } from './mock';

jest.mock('../../api/client', () => ({
  ...jest.requireActual('../../api/client'),
  apiGet: jest.fn(),
  apiRequest: jest.fn(),
}));

const apiGet = jest.mocked(client.apiGet);
const apiRequest = jest.mocked(client.apiRequest);

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockResponse: IssueListResponse = {
  items: [MOCK_ISSUES[0]],
  counts: {
    all: 4,
    active: 3,
    done: 1,
  },
};

describe('useIssues', () => {
  beforeEach(() => {
    apiGet.mockReset();
    setMockMode(false);
  });

  it('loads the current user issues with pagination and status group', async () => {
    apiGet.mockResolvedValueOnce(mockResponse);

    const { result } = await renderHook(
      () =>
        useIssues({
          limit: 10,
          offset: 20,
          statusGroup: 'active',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiGet).toHaveBeenCalledWith(
      '/issues?mine=true&status_group=active&limit=10&offset=20',
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it('loads all current user issues without a status group', async () => {
    apiGet.mockResolvedValueOnce(mockResponse);

    const { result } = await renderHook(
      () => useIssues({ limit: 20, offset: 0 }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiGet).toHaveBeenCalledWith('/issues?mine=true&limit=20&offset=0');
  });
});

describe('fetchIssueDetails', () => {
  beforeEach(() => {
    apiGet.mockReset();
    setMockMode(false);
  });

  it('loads issue details from the API', async () => {
    const mockDetail: IssueDetail = {
      ...MOCK_ISSUE_DETAILS[MOCK_ISSUES[0].id],
      assigned_master: {
        name: 'Тестовий Майстер',
        rating: 4.8,
      },
    };

    apiGet.mockResolvedValueOnce(mockDetail);

    const result = await fetchIssueDetails(MOCK_ISSUES[0].id);

    expect(apiGet).toHaveBeenCalledWith(
      `/issues/${MOCK_ISSUES[0].id}`,
    );
    expect(result).toEqual(mockDetail);
    expect(result.assigned_master?.name).toBe('Тестовий Майстер');
  });
});

describe('mock mode', () => {
  beforeEach(() => apiGet.mockReset());

  afterEach(() => setMockMode(false));

  it('returns mock issues and counts without calling the API', async () => {
    setMockMode(true);

    const result = await fetchIssues();

    expect(result.items).toEqual(MOCK_ISSUES);
    expect(result.counts).toEqual({
      all: 4,
      active: 3,
      done: 1,
    });
    expect(apiGet).not.toHaveBeenCalled();
  });

  it('returns mock issue details without calling the API', async () => {
  setMockMode(true);

  const issueId = MOCK_ISSUES[0].id;
  const result = await fetchIssueDetails(issueId);

  expect(result).toEqual(MOCK_ISSUE_DETAILS[issueId]);
  expect(result.timeline).toHaveLength(1);
  expect(result.assigned_master).toBeNull();
  expect(apiGet).not.toHaveBeenCalled();
  });

  it('filters and paginates active mock issues', async () => {
    setMockMode(true);

    const result = await fetchIssues({
      statusGroup: 'active',
      limit: 1,
      offset: 0,
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].status).toBe('in_progress');
    expect(result.counts).toEqual({
      all: 4,
      active: 3,
      done: 1,
    });
    expect(apiGet).not.toHaveBeenCalled();
  });

  it('filters completed mock issues', async () => {
    setMockMode(true);

    const result = await fetchIssues({
      statusGroup: 'done',
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].status).toBe('done');
  });
});

describe('createIssue', () => {
  beforeEach(() => {
    apiRequest.mockReset();
    setMockMode(false);
  });

  it('creates an issue assigned to a service center', async () => {
    const input: CreateIssueInput = {
      title: 'Ремонт смартфона',
      description: 'Розбитий екран',
      category_id: 2,
      address: 'вул. Наукова, 7А',
      assignee_company_id: 18,
    };

    apiRequest.mockResolvedValueOnce({
      ...MOCK_ISSUES[0],
      ...input,
    });

    const result = await createIssue(input);

    expect(apiRequest).toHaveBeenCalledWith('/issues', {
      method: 'POST',
      body: input,
    });

    expect(result.assignee_company_id).toBe(18);
    expect(result.category_id).toBe(2);
  });
});