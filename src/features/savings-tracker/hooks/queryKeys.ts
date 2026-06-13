export const savingsGoalsKeys = {
  all: ['savings-goals'] as const,
  list: (params: { pageNumber: number; pageSize: number }) =>
    [...savingsGoalsKeys.all, params] as const,
};
