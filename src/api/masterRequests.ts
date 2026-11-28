import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiRequest, getAuthSessionGeneration } from '../../api/client';
import { withMock } from './mock';

type MasterRequestResponse = {
  id: number;
  title: string;
  status: string;
  client_first_name: string;
  district: string | null;
  time_ago: string;
  created_at: string;
  category_id?: number | null;
};

export type MasterRequest = {
  id: number;
  title: string;
  clientFirstName: string;
  district: string | null;
  timeAgo: string;
  createdAt: Date;
  categoryId: number | null;
};

export type RequestDecision = 'accept' | 'decline';

export function toMasterRequest(response: MasterRequestResponse): MasterRequest {
  return {
    id: response.id,
    title: response.title,
    clientFirstName: response.client_first_name,
    district: response.district,
    timeAgo: response.time_ago,
    createdAt: new Date(response.created_at),
    categoryId: response.category_id ?? null,
  };
}

export const MOCK_MASTER_REQUESTS: MasterRequest[] = [
  {
    id: 41,
    title: 'Пральна машина не зливає воду',
    clientFirstName: 'Олександр',
    district: 'Сихів',
    timeAgo: '10 хв тому',
    createdAt: new Date('2026-11-27T09:50:00Z'),
    categoryId: 1,
  },
  {
    id: 42,
    title: 'Не крутиться барабан',
    clientFirstName: 'Марія',
    district: 'Центр',
    timeAgo: '1 год тому',
    createdAt: new Date('2026-11-27T09:00:00Z'),
    categoryId: 1,
  },
];

export function incomingRequestsKey(userId: number | undefined) {
  return ['masters', 'me', 'requests', 'sent', userId] as const;
}

export function sortNewestFirst(requests: MasterRequest[]): MasterRequest[] {
  return [...requests].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id,
  );
}

export function fetchIncomingRequests(): Promise<MasterRequest[]> {
  return withMock(
    async () =>
      (await apiGet<MasterRequestResponse[]>('/masters/me/requests?status=sent')).map(
        toMasterRequest,
      ),
    () => MOCK_MASTER_REQUESTS,
  );
}

export function useIncomingRequests(userId: number | undefined) {
  return useQuery({
    queryKey: incomingRequestsKey(userId),
    queryFn: fetchIncomingRequests,
    enabled: userId !== undefined,
  });
}

export function respondToRequest(issueId: number, decision: RequestDecision): Promise<void> {
  return withMock(
    async () => {
      await apiRequest<unknown>(`/issues/${issueId}/${decision}`, { method: 'POST' });
    },
    () => undefined,
  );
}

export function respondMutationKey(userId: number | undefined) {
  return ['masters', 'me', 'requests', 'respond', userId] as const;
}

export function useRespondToRequest(userId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: respondMutationKey(userId),
    mutationFn: ({ issueId, decision }: { issueId: number; decision: RequestDecision }) =>
      respondToRequest(issueId, decision),
    onMutate: async ({ issueId }) => {
      const key = incomingRequestsKey(userId);
      const generation = getAuthSessionGeneration();
      await queryClient.cancelQueries({ queryKey: key });
      const current = queryClient.getQueryData<MasterRequest[]>(key);
      const removed = current?.find((request) => request.id === issueId);
      if (current) {
        queryClient.setQueryData<MasterRequest[]>(
          key,
          current.filter((request) => request.id !== issueId),
        );
      }
      return { key, generation, removed };
    },
    onSuccess: (_data, { issueId }, context) => {
      if (!context || context.generation !== getAuthSessionGeneration()) {
        return;
      }
      queryClient.setQueryData<MasterRequest[]>(context.key, (current) =>
        current?.filter((request) => request.id !== issueId),
      );
    },
    onError: (_error, _variables, context) => {
      if (!context?.removed || context.generation !== getAuthSessionGeneration()) {
        return;
      }
      const removed = context.removed;
      queryClient.setQueryData<MasterRequest[]>(context.key, (current) =>
        current && !current.some((request) => request.id === removed.id)
          ? sortNewestFirst([...current, removed])
          : current,
      );
    },
    onSettled: (_data, _error, _variables, context) => {
      if (!context || context.generation !== getAuthSessionGeneration()) {
        return;
      }
      void queryClient.invalidateQueries({ queryKey: context.key });
      void queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function usePendingDecisionIds(userId: number | undefined): number[] {
  return useMutationState({
    filters: { mutationKey: respondMutationKey(userId), status: 'pending' },
    select: (mutation) => (mutation.state.variables as { issueId: number } | undefined)?.issueId,
  }).filter((issueId): issueId is number => issueId !== undefined);
}

export function useFailedDecisionIds(userId: number | undefined): number[] {
  return useMutationState({
    filters: { mutationKey: respondMutationKey(userId), status: 'error' },
    select: (mutation) => (mutation.state.variables as { issueId: number } | undefined)?.issueId,
  }).filter((issueId): issueId is number => issueId !== undefined);
}

export function visibleRequests(requests: MasterRequest[], pendingIds: number[]): MasterRequest[] {
  return pendingIds.length === 0
    ? requests
    : requests.filter((request) => !pendingIds.includes(request.id));
}
