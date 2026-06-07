import { useMutation } from '@tanstack/react-query';

import { useAuthApi } from '../../../api/useAPI';

interface LoginParams {
  email: string;
  password: string;
}

export function useLogin() {
  const authApi = useAuthApi();

  return useMutation({
    mutationFn: ({ email, password }: LoginParams) =>
      authApi.authControllerLogin({ loginDto: { email, password } }),
  });
}
