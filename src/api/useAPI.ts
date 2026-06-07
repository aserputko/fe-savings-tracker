import { useCallback, useMemo } from 'react';

import { getToken } from '../features/auth/lib/token';
import * as api from './generated';

export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];

export function useFetchApi() {
  return useCallback<FetchAPI>(
    async (url, init) => {
      const headers: HeadersInit = {};
      const token = getToken();

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        window.console.warn('[FetchAPI][Warn]: Access token is unavailable');
      }

      const response = await fetch(url, {
        ...init,
        headers: {
          ...init?.headers,
          ...headers,
        }
      });

      return response;
    },
    []
  );
}



function useConfig() {
  const fetchApi = useFetchApi();
  const baseConfig = useMemo(
    () => ({
      basePath: 'http://localhost:4000',
      fetchApi
    }),
    [fetchApi]
  );

  return useMemo(() => new api.Configuration(baseConfig), [baseConfig]);
}

const createApi =
  <T>(ApiClass: new (config: api.Configuration) => T): (() => T) =>
  () => {
    const config = useConfig();

    return useMemo(() => new ApiClass(config), [config]);
  };

export const useAuthApi = createApi(api.AuthApi);
export const useSavingsApi = createApi(api.SavingsGoalsApi);
