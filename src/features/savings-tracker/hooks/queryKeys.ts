export const savingsGoalsKeys = {
  all: ['savings-goals'] as const,
  list: (params: { pageNumber: number; pageSize: number }) =>
    [...savingsGoalsKeys.all, params] as const,
  detail: (id: string) => [...savingsGoalsKeys.all, 'detail', id] as const,
};
