import { useQuery } from '@tanstack/react-query';

import { useSavingsApi } from '../../../api/useAPI';
import { savingsGoalsKeys } from './queryKeys';

export function useSavingsGoalById(id: string) {
  const savingsApi = useSavingsApi();

  return useQuery({
    queryKey: savingsGoalsKeys.detail(id),
    queryFn: () => savingsApi.savingsGoalControllerFindOne({ id }),
    enabled: !!id,
  });
}
