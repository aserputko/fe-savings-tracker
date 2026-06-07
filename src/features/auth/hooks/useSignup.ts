import { useMutation } from '@tanstack/react-query';

import { useAuthApi } from '../../../api/useAPI';

interface SignupParams {
  fullName: string;
  email: string;
  password: string;
}

export function useSignup() {
  const authApi = useAuthApi();

  return useMutation({
    mutationFn: ({ fullName, email, password }: SignupParams) =>
      authApi.authControllerSignup({ signupDto: { fullName, email, password } }),
  });
}
