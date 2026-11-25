import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../api/client';
import { issueTitleFromDescription, type IssueDraft } from '../issueDraft';
import type { Issue } from './issues';
import { withMock } from './mock';

export type IssueAssignee = { masterId: number } | { companyId: number };

export type IssueCreateBody = {
  title: string;
  description: string;
  category_id: number;
  assignee_master_id?: number;
  assignee_company_id?: number;
};

export function buildIssueCreate(draft: IssueDraft, assignee: IssueAssignee): IssueCreateBody {
  return {
    title: issueTitleFromDescription(draft.description),
    description: draft.description.trim(),
    category_id: draft.categoryId,
    ...('masterId' in assignee
      ? { assignee_master_id: assignee.masterId }
      : { assignee_company_id: assignee.companyId }),
  };
}

function mockCreatedIssue(body: IssueCreateBody): Issue {
  const now = new Date().toISOString();
  return {
    id: 101,
    title: body.title,
    description: body.description,
    category_id: body.category_id,
    address: null,
    district: null,
    status: 'sent',
    owner_id: 1,
    assignee_master_id: body.assignee_master_id ?? null,
    assignee_company_id: body.assignee_company_id ?? null,
    created_at: now,
    updated_at: now,
  };
}

export function createIssue(draft: IssueDraft, assignee: IssueAssignee): Promise<Issue> {
  const body = buildIssueCreate(draft, assignee);
  return withMock(
    () => apiRequest<Issue>('/issues', { method: 'POST', body }),
    () => mockCreatedIssue(body),
  );
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ draft, assignee }: { draft: IssueDraft; assignee: IssueAssignee }) =>
      createIssue(draft, assignee),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });
}