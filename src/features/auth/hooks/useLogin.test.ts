import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useLogin } from './useLogin';

const mockAuthControllerLogin = vi.fn();

vi.mock('../../../api/useAPI', () => ({
  useAuthApi: () => ({
    authControllerLogin: mockAuthControllerLogin,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useLogin', () => {
  it('GIVEN valid credentials WHEN mutationFn is invoked THEN calls authControllerLogin with loginDto', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    const params = { email: 'user@example.com', password: 'password123' };
    await act(async () => {
      result.current.mutate(params);
    });

    expect(mockAuthControllerLogin).toHaveBeenCalledWith({
      loginDto: { email: 'user@example.com', password: 'password123' },
    });
  });
});
