import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLogin } from '../hooks/useLogin';
import { setToken } from '../lib/token';
import { LoginView } from './LoginView';

vi.mock('../hooks/useLogin');
vi.mock('../lib/token');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function makeMutate() {
  return vi.fn();
}

function renderLoginView() {
  const result = render(
    <MemoryRouter>
      <LoginView />
    </MemoryRouter>,
  );
  const emailInput = result.container.querySelector('input[name="email"]') as HTMLInputElement;
  const passwordInput = result.container.querySelector(
    'input[name="password"]',
  ) as HTMLInputElement;
  return { ...result, emailInput, passwordInput };
}

function setupUseLogin({
  isPending = false,
  error = null,
  mutate = makeMutate(),
}: {
  isPending?: boolean;
  error?: Error | null;
  mutate?: ReturnType<typeof makeMutate>;
} = {}) {
  vi.mocked(useLogin).mockReturnValue({
    mutate,
    isPending,
    error,
  } as unknown as ReturnType<typeof useLogin>);
  return { mutate };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LoginView', () => {
  // TC-1 — Render Login page for unauthenticated visitor
  it('GIVEN the login page WHEN rendered THEN heading, fields, submit button and create-one link are visible', () => {
    setupUseLogin();
    const { emailInput, passwordInput } = renderLoginView();

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create one' })).toBeInTheDocument();
  });

  // TC-3 — Loading state
  it('GIVEN isPending is true WHEN rendered THEN button is disabled and label changes to "Signing in…"', () => {
    setupUseLogin({ isPending: true });
    renderLoginView();

    const button = screen.getByRole('button', { name: 'Signing in…' });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Signing in…');
  });

  // TC-5 — "Create one" link navigates to /signup
  it('GIVEN the login page WHEN rendered THEN "Create one" link points to /signup', () => {
    setupUseLogin();
    renderLoginView();

    expect(screen.getByRole('link', { name: 'Create one' })).toHaveAttribute('href', '/signup');
  });

  // TC-6 — Both fields empty on submission
  it('GIVEN both fields are empty WHEN user clicks Sign in THEN email and password errors are shown and mutate is NOT called', async () => {
    const { mutate } = setupUseLogin();
    renderLoginView();

    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-7 — Invalid email format
  it('GIVEN email is "notanemail" and password is valid WHEN user clicks Sign in THEN only email format error is shown', async () => {
    const { mutate } = setupUseLogin();
    const { emailInput, passwordInput } = renderLoginView();

    await userEvent.type(emailInput, 'notanemail');
    await userEvent.type(passwordInput, 'validpassword');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-9 — Password exactly 7 characters (boundary — invalid)
  it('GIVEN password has exactly 7 characters WHEN user clicks Sign in THEN password min-length error is shown', async () => {
    const { mutate } = setupUseLogin();
    const { emailInput, passwordInput } = renderLoginView();

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'abc1234');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-10 — Password exactly 8 characters (boundary — valid)
  it('GIVEN password has exactly 8 characters WHEN user clicks Sign in THEN no password error and mutate is called', async () => {
    const { mutate } = setupUseLogin();
    const { emailInput, passwordInput } = renderLoginView();

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'abcd1234');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
    expect(mutate).toHaveBeenCalledOnce();
  });

  // TC-15 — Email blank, password valid
  it('GIVEN email is empty and password is valid WHEN user clicks Sign in THEN only email error is shown', async () => {
    const { mutate } = setupUseLogin();
    const { passwordInput } = renderLoginView();

    await userEvent.type(passwordInput, 'validpassword');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-16 — Password blank, email valid
  it('GIVEN email is valid and password is empty WHEN user clicks Sign in THEN only password error is shown', async () => {
    const { mutate } = setupUseLogin();
    const { emailInput } = renderLoginView();

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-17 — Email with spaces treated as invalid
  it('GIVEN email contains a space WHEN user clicks Sign in THEN email format error is shown', async () => {
    const { mutate } = setupUseLogin();
    const { emailInput, passwordInput } = renderLoginView();

    await userEvent.type(emailInput, 'user @example.com');
    await userEvent.type(passwordInput, 'validpassword');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-2 + TC-18 — Successful login: setToken called before navigate
  it('GIVEN valid credentials WHEN API responds with 200 and access_token THEN setToken is called before navigate to /dashboard', async () => {
    const callOrder: string[] = [];
    vi.mocked(setToken).mockImplementation(() => {
      callOrder.push('setToken');
    });
    mockNavigate.mockImplementation(() => {
      callOrder.push('navigate');
    });

    const mutate = vi.fn().mockImplementation((_data, { onSuccess }) => {
      onSuccess({ access_token: 'test-token' });
    });
    setupUseLogin({ mutate });
    const { emailInput, passwordInput } = renderLoginView();

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(setToken).toHaveBeenCalledWith('test-token');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(callOrder).toEqual(['setToken', 'navigate']);
  });

  // TC-11 / TC-12 / TC-13 / TC-14 — API error shows generic message
  it('GIVEN API returns an error WHEN rendered THEN generic error message is visible and button is re-enabled', () => {
    setupUseLogin({ error: new Error('401 Unauthorized') });
    renderLoginView();

    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).not.toBeDisabled();
  });

  // TC-19 — Native browser validation is suppressed
  it('GIVEN the login form WHEN rendered THEN form element has noValidate attribute', () => {
    setupUseLogin();
    const { container } = renderLoginView();

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('novalidate');
  });
});
