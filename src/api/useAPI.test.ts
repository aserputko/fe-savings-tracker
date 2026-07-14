import { renderHook } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getToken, removeToken } from '../features/auth/lib/token';
import { useFetchApi } from './useAPI';

vi.mock('../features/auth/lib/token');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderFetchApi() {
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(MemoryRouter, null, children);
  return renderHook(() => useFetchApi(), { wrapper }).result;
}

function makeResponse(status: number) {
  return new Response(null, { status });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useFetchApi — KAN-50 401 handling', () => {
  it('GIVEN a valid token WHEN response is 401 THEN clears the token and redirects to /login with sessionExpired state', async () => {
    vi.mocked(getToken).mockReturnValue('valid.token.value');
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(makeResponse(401));

    const { current: fetchApi } = renderFetchApi();
    const response = await fetchApi('http://localhost:4000/savings-goals', { method: 'POST' });

    expect(response.status).toBe(401);
    expect(removeToken).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      replace: true,
      state: { sessionExpired: true },
    });
  });

  it('GIVEN no token WHEN response is 401 THEN does NOT clear the token and does NOT redirect (login attempt with bad credentials)', async () => {
    vi.mocked(getToken).mockReturnValue(null);
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(makeResponse(401));

    const { current: fetchApi } = renderFetchApi();
    const response = await fetchApi('http://localhost:4000/auth/login', { method: 'POST' });

    expect(response.status).toBe(401);
    expect(removeToken).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('GIVEN a valid token WHEN response is 2xx THEN does NOT clear the token and does NOT redirect', async () => {
    vi.mocked(getToken).mockReturnValue('valid.token.value');
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(makeResponse(200));

    const { current: fetchApi } = renderFetchApi();
    await fetchApi('http://localhost:4000/savings-goals');

    expect(removeToken).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('GIVEN a valid token WHEN response is 500 THEN does NOT clear the token and does NOT redirect', async () => {
    vi.mocked(getToken).mockReturnValue('valid.token.value');
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(makeResponse(500));

    const { current: fetchApi } = renderFetchApi();
    const response = await fetchApi('http://localhost:4000/savings-goals');

    expect(response.status).toBe(500);
    expect(removeToken).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('GIVEN a valid token WHEN request is made THEN Authorization header is set', async () => {
    vi.mocked(getToken).mockReturnValue('valid.token.value');
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValueOnce(makeResponse(200));

    const { current: fetchApi } = renderFetchApi();
    await fetchApi('http://localhost:4000/savings-goals');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer valid.token.value');
  });
});
