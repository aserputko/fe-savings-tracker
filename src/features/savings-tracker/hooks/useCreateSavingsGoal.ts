import { useMutation } from '@tanstack/react-query';

import { useSavingsApi } from '../../../api/useAPI';

interface CreateSavingsGoalParams {
  name: string;
  targetAmount: number;
  deadline?: string;
}

export function useCreateSavingsGoal() {
  const savingsApi = useSavingsApi();

  return useMutation({
    mutationFn: ({ name, targetAmount, deadline }: CreateSavingsGoalParams) =>
      savingsApi.savingsGoalControllerCreate({
        createSavingsGoalDto: { name, targetAmount, deadline },
      }),
  });
}
