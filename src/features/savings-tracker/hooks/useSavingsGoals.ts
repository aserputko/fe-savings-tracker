import { useQuery } from '@tanstack/react-query';

import { useSavingsApi } from '../../../api/useAPI';
import { savingsGoalsKeys } from './queryKeys';

interface UseSavingsGoalsParams {
  pageNumber?: number;
  pageSize?: number;
}

export function useSavingsGoals({ pageNumber = 1, pageSize = 8 }: UseSavingsGoalsParams = {}) {
  const savingsApi = useSavingsApi();

  return useQuery({
    queryKey: savingsGoalsKeys.list({ pageNumber, pageSize }),
    queryFn: () => savingsApi.savingsGoalControllerFindAll({ pageNumber, pageSize }),
  });
}
