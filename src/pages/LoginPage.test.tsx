import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LoginPage } from './LoginPage';

vi.mock('@/features/auth/components/LoginView', () => ({
  LoginView: () => <div data-testid="login-view" />,
}));

describe('LoginPage', () => {
  it('GIVEN default props WHEN rendered THEN LoginView is present in the DOM', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-view')).toBeInTheDocument();
  });
});
