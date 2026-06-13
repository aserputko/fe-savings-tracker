import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useSignup } from './useSignup';

const mockAuthControllerSignup = vi.fn();

vi.mock('../../../api/useAPI', () => ({
  useAuthApi: () => ({
    authControllerSignup: mockAuthControllerSignup,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useSignup', () => {
  it('GIVEN valid params WHEN mutationFn is invoked THEN calls authControllerSignup with signupDto', async () => {
    const { result } = renderHook(() => useSignup(), { wrapper: createWrapper() });

    const params = { fullName: 'Jane Doe', email: 'jane@example.com', password: 'securepass1' };
    await act(async () => {
      result.current.mutate(params);
    });

    expect(mockAuthControllerSignup).toHaveBeenCalledWith({
      signupDto: { fullName: 'Jane Doe', email: 'jane@example.com', password: 'securepass1' },
    });
  });
});
