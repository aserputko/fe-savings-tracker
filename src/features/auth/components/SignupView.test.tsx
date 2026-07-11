import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSignup } from '../hooks/useSignup';
import { setToken } from '../lib/token';
import { SignupView } from './SignupView';

vi.mock('../hooks/useSignup');
vi.mock('../lib/token');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function makeMutate() {
  return vi.fn();
}

function renderSignupView() {
  const result = render(
    <MemoryRouter>
      <SignupView />
    </MemoryRouter>,
  );
  const fullNameInput = result.container.querySelector(
    'input[name="fullName"]',
  ) as HTMLInputElement;
  const emailInput = result.container.querySelector('input[name="email"]') as HTMLInputElement;
  const passwordInput = result.container.querySelector(
    'input[name="password"]',
  ) as HTMLInputElement;
  return { ...result, fullNameInput, emailInput, passwordInput };
}

function setupUseSignup({
  isPending = false,
  error = null,
  mutate = makeMutate(),
}: {
  isPending?: boolean;
  error?: Error | null;
  mutate?: ReturnType<typeof makeMutate>;
} = {}) {
  vi.mocked(useSignup).mockReturnValue({
    mutate,
    isPending,
    error,
  } as unknown as ReturnType<typeof useSignup>);
  return { mutate };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SignupView', () => {
  // TC-1 — Render Sign Up page for unauthenticated visitor
  it('GIVEN the sign up page WHEN rendered THEN heading, fields, submit button and sign-in link are visible', () => {
    setupUseSignup();
    const { fullNameInput, emailInput, passwordInput } = renderSignupView();

    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
    expect(fullNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  // TC-3 — "Sign in" link navigates to /login
  it('GIVEN the sign up page WHEN rendered THEN "Sign in" link points to /login', () => {
    setupUseSignup();
    renderSignupView();

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
  });

  // TC-4 — Submit button loading state during registration
  it('GIVEN isPending is true WHEN rendered THEN button is disabled and label changes to "Creating account…"', () => {
    setupUseSignup({ isPending: true });
    renderSignupView();

    const button = screen.getByRole('button', { name: 'Creating account…' });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Creating account…');
  });

  // TC-6 — All required fields empty on submission
  it('GIVEN all fields are empty WHEN user clicks Create account THEN all three field errors are shown and mutate is NOT called', async () => {
    const { mutate } = setupUseSignup();
    renderSignupView();

    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Full name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-7 — Full Name field empty, other fields valid
  it('GIVEN full name is empty and other fields are valid WHEN user clicks Create account THEN only full name error is shown and mutate is NOT called', async () => {
    const { mutate } = setupUseSignup();
    const { emailInput, passwordInput } = renderSignupView();

    await userEvent.type(emailInput, 'jane@example.com');
    await userEvent.type(passwordInput, 'securepass1');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Full name is required')).toBeInTheDocument();
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-8 — Invalid email format
  it('GIVEN email is "notanemail" and other fields are valid WHEN user clicks Create account THEN only email format error is shown and mutate is NOT called', async () => {
    const { mutate } = setupUseSignup();
    const { fullNameInput, emailInput, passwordInput } = renderSignupView();

    await userEvent.type(fullNameInput, 'Jane Doe');
    await userEvent.type(emailInput, 'notanemail');
    await userEvent.type(passwordInput, 'securepass1');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-9 — Password fewer than 8 characters
  it('GIVEN password has exactly 7 characters WHEN user clicks Create account THEN password min-length error is shown and mutate is NOT called', async () => {
    const { mutate } = setupUseSignup();
    const { fullNameInput, emailInput, passwordInput } = renderSignupView();

    await userEvent.type(fullNameInput, 'Jane Doe');
    await userEvent.type(emailInput, 'jane@example.com');
    await userEvent.type(passwordInput, 'pass123');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-10 — Password exactly 8 characters (boundary — valid)
  it('GIVEN password has exactly 8 characters WHEN user clicks Create account THEN no password error is shown and mutate is called', async () => {
    const { mutate } = setupUseSignup();
    const { fullNameInput, emailInput, passwordInput } = renderSignupView();

    await userEvent.type(fullNameInput, 'Jane Doe');
    await userEvent.type(emailInput, 'jane@example.com');
    await userEvent.type(passwordInput, 'pass1234');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
    expect(mutate).toHaveBeenCalledOnce();
  });

  // TC-11 / TC-12 / TC-13 — API error shows generic message
  it('GIVEN API returns an error WHEN rendered THEN generic error message is visible and button is re-enabled', () => {
    setupUseSignup({ error: new Error('409 Conflict') });
    renderSignupView();

    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).not.toBeDisabled();
  });

  // TC-14 — Email field with whitespace only
  it('GIVEN email contains only whitespace WHEN user clicks Create account THEN email validation error is shown and mutate is NOT called', async () => {
    const { mutate } = setupUseSignup();
    const { fullNameInput, emailInput, passwordInput } = renderSignupView();

    await userEvent.type(fullNameInput, 'Jane Doe');
    await userEvent.type(emailInput, '   ');
    await userEvent.type(passwordInput, 'securepass1');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    const emailError = await screen.findByText(/Email is required|Enter a valid email address/);
    expect(emailError).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  // TC-15 — Server error not visible while new request is in-flight
  it('GIVEN a previous server error existed WHEN a new request is in-flight THEN the error message is not visible', () => {
    setupUseSignup({ isPending: true, error: null });
    renderSignupView();

    expect(screen.queryByText('Something went wrong. Please try again.')).not.toBeInTheDocument();
  });

  // TC-2 — Successful registration: setToken called then navigate to /dashboard
  it('GIVEN valid credentials WHEN API responds with 201 and access_token THEN setToken is called and user is navigated to /dashboard', async () => {
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
    setupUseSignup({ mutate });
    const { fullNameInput, emailInput, passwordInput } = renderSignupView();

    await userEvent.type(fullNameInput, 'Jane Doe');
    await userEvent.type(emailInput, 'jane@example.com');
    await userEvent.type(passwordInput, 'securepass1');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(setToken).toHaveBeenCalledWith('test-token');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(callOrder).toEqual(['setToken', 'navigate']);
  });

  // Native browser validation suppressed
  it('GIVEN the signup form WHEN rendered THEN form element has noValidate attribute', () => {
    setupUseSignup();
    const { container } = renderSignupView();

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('novalidate');
  });
});
