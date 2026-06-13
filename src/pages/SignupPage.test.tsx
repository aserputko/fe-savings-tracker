import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SignupPage } from './SignupPage';

vi.mock('@/features/auth/components/SignupView', () => ({
  SignupView: () => <div data-testid="signup-view" />,
}));

describe('SignupPage', () => {
  it('GIVEN default props WHEN rendered THEN SignupView is present in the DOM', () => {
    render(<SignupPage />);
    expect(screen.getByTestId('signup-view')).toBeInTheDocument();
  });
});
