import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { getToken, removeToken } from '../features/auth/lib/token';
import * as api from './generated';

export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];

export function useFetchApi() {
  const navigate = useNavigate();

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
        },
      });

      // KAN-50: If the request was authenticated (we sent a token) and the API
      // rejected it with 401, the token is invalid/expired. Clear it and
      // redirect the user to /login so they can re-authenticate.
      if (response.status === 401 && token) {
        removeToken();
        navigate('/login', { replace: true, state: { sessionExpired: true } });
      }

      return response;
    },
    [navigate],
  );
}

function useConfig() {
  const fetchApi = useFetchApi();
  const baseConfig = useMemo(
    () => ({
      // Set per environment at build time (VITE_API_URL). Falls back to the
      // local API for `npm run dev` and tests where the var is unset.
      basePath: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
      fetchApi,
    }),
    [fetchApi],
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
