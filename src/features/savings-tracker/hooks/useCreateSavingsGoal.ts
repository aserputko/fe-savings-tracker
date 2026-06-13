import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSavingsApi } from '../../../api/useAPI';
import { savingsGoalsKeys } from './queryKeys';

interface CreateSavingsGoalParams {
  name: string;
  targetAmount: number;
  deadline?: string;
}

export function useCreateSavingsGoal() {
  const savingsApi = useSavingsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, targetAmount, deadline }: CreateSavingsGoalParams) =>
      savingsApi.savingsGoalControllerCreate({
        createSavingsGoalDto: { name, targetAmount, deadline },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savingsGoalsKeys.all });
    },
  });
}
