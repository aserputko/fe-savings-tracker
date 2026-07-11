import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSavingsApi } from '../../../api/useAPI';
import { savingsGoalsKeys } from './queryKeys';

interface AddGoalDepositParams {
  goalId: string;
  amount: number;
  note?: string;
}

export function useAddGoalDeposit() {
  const savingsApi = useSavingsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, amount, note }: AddGoalDepositParams) =>
      savingsApi.savingsGoalControllerAddDeposit({
        id: goalId,
        addDepositDto: { amount, note },
      }),
    onSuccess: (_data, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: savingsGoalsKeys.detail(goalId) });
    },
  });
}
