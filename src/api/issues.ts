import { useQuery } from '@tanstack/react-query';
import { apiGet, apiRequest } from '../../api/client';
import { withMock } from './mock';

export type BackendIssueStatus =
  'sent' | 'accepted' | 'in_progress' | 'done' | 'declined' | 'cancelled';

export type Issue = {
  id: number;
  title: string;
  description: string;
  category_id: number;
  address: string | null;
  district: string | null;
  status: BackendIssueStatus;
  owner_id: number;
  assignee_master_id: number | null;
  assignee_company_id: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateIssueInput = {
  title: string;
  description: string;
  category_id: number;
  address?: string | null;
  district?: string | null;
  assignee_company_id: number;
};

export type IssueStatusEvent = {
  id: number;
  status: BackendIssueStatus;
  created_at: string;
  actor_id: number;
};

export type AssignedMaster = {
  name: string;
  rating: number | null;
};

export type IssueDetail = Issue & {
  timeline: IssueStatusEvent[];
  assigned_master: AssignedMaster | null;
};

export type IssueCounts = {
  all: number;
  active: number;
  done: number;
};

export type IssueListResponse = {
  items: Issue[];
  counts: IssueCounts;
};

export type IssuesParams = {
  limit?: number;
  offset?: number;
  statusGroup?: 'active' | 'done';
};

const ACTIVE_STATUSES: BackendIssueStatus[] = [
  'sent',
  'accepted',
  'in_progress',
];

export const MOCK_ISSUES: Issue[] = [
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
    category_id: 2,
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

export const MOCK_ISSUE_DETAILS: Record<number, IssueDetail> = {
  ...Object.fromEntries(
    MOCK_ISSUES.map((issue) => [
      issue.id,
      {
        ...issue,
        timeline: [
          {
            id: issue.id,
            status: issue.status,
            created_at: issue.updated_at,
            actor_id: issue.owner_id,
          },
        ],
        assigned_master: null,
      },
    ]),
  ),
};

function getMockCounts(issues: Issue[]): IssueCounts {
  return {
    all: issues.length,
    active: issues.filter((issue) => ACTIVE_STATUSES.includes(issue.status))
      .length,
    done: issues.filter((issue) => issue.status === 'done').length,
  };
}

export async function fetchIssues(
  params: IssuesParams = {},
): Promise<IssueListResponse> {
  const query = new URLSearchParams();

  query.set('mine', 'true');

  if (params.statusGroup !== undefined) {
    query.set('status_group', params.statusGroup);
  }

  if (params.limit !== undefined) {
    query.set('limit', String(params.limit));
  }

  if (params.offset !== undefined) {
    query.set('offset', String(params.offset));
  }

  return withMock(
    () => apiGet<IssueListResponse>(`/issues?${query.toString()}`),
    () => {
      const allIssues = [...MOCK_ISSUES];
      const counts = getMockCounts(allIssues);

      let filteredIssues = allIssues;

      if (params.statusGroup === 'active') {
        filteredIssues = filteredIssues.filter((issue) =>
          ACTIVE_STATUSES.includes(issue.status),
        );
      }

      if (params.statusGroup === 'done') {
        filteredIssues = filteredIssues.filter(
          (issue) => issue.status === 'done',
        );
      }

      const offset = params.offset ?? 0;
      const limit = params.limit ?? 20;

      return {
        items: filteredIssues.slice(offset, offset + limit),
        counts,
      };
    },
  );
}

export async function fetchIssueDetails(
  issueId: number,
): Promise<IssueDetail> {
  return withMock(
    () => apiGet<IssueDetail>(`/issues/${issueId}`),
    () => {
      const issue = MOCK_ISSUE_DETAILS[issueId];

      if (!issue) {
        throw new Error(`Mock issue ${issueId} not found`);
      }

      return issue;
    },
  );
}

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  return apiRequest<Issue>('/issues', {
    method: 'POST',
    body: input,
  });
}

export function useIssues(params: IssuesParams = {}) {
  return useQuery({
    queryKey: ['issues', 'mine', params],
    queryFn: () => fetchIssues(params),
  });
}
