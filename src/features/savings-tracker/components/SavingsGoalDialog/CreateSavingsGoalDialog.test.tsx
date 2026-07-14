import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ResponseError } from '@/api/generated';

import { useCreateSavingsGoal } from '../../hooks';
import { CreateSavingsGoalDialog } from './CreateSavingsGoalDialog';

vi.mock('../../hooks', () => ({
  useCreateSavingsGoal: vi.fn(),
}));

type MutateFn = ReturnType<typeof vi.fn>;

function renderDialog() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const onOpenChange = vi.fn();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const result = render(<CreateSavingsGoalDialog open onOpenChange={onOpenChange} />, { wrapper });
  return { ...result, onOpenChange };
}

function setupUseCreateSavingsGoal({
  isPending = false,
  mutate = vi.fn() as MutateFn,
}: {
  isPending?: boolean;
  mutate?: MutateFn;
} = {}) {
  vi.mocked(useCreateSavingsGoal).mockReturnValue({
    mutate,
    isPending,
  } as unknown as ReturnType<typeof useCreateSavingsGoal>);
  return { mutate };
}

async function fillValidForm() {
  await userEvent.type(screen.getByPlaceholderText('e.g. MacBook Pro M4'), 'MacBook Pro M4');
  await userEvent.type(screen.getByPlaceholderText('0.00'), '2499');
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CreateSavingsGoalDialog — KAN-49 duplicate handling', () => {
  it('GIVEN API returns 409 WHEN submitting THEN inline error is shown under Goal name and dialog stays open', async () => {
    const mutate = vi.fn((_vars, options) => {
      const response = new Response(null, { status: 409, statusText: 'Conflict' });
      options?.onError?.(new ResponseError(response, 'Conflict'));
    }) as MutateFn;
    setupUseCreateSavingsGoal({ mutate });
    const { onOpenChange } = renderDialog();

    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Create goal/i }));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('A goal with this name already exists')).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Something went wrong. Please try again.')).not.toBeInTheDocument();
  });

  it('GIVEN API returns a non-409 error WHEN submitting THEN generic error is shown above buttons and dialog stays open', async () => {
    const mutate = vi.fn((_vars, options) => {
      const response = new Response(null, { status: 500, statusText: 'Server Error' });
      options?.onError?.(new ResponseError(response, 'Internal Server Error'));
    }) as MutateFn;
    setupUseCreateSavingsGoal({ mutate });
    const { onOpenChange } = renderDialog();

    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Create goal/i }));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(await screen.findByTestId('create-savings-goal-error')).toHaveTextContent(
      'Something went wrong. Please try again.',
    );
    expect(screen.queryByText('A goal with this name already exists')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('GIVEN API returns 201 WHEN submitting THEN the dialog is closed and no errors are shown', async () => {
    const mutate = vi.fn((_vars, options) => {
      options?.onSuccess?.({} as never);
    }) as MutateFn;
    setupUseCreateSavingsGoal({ mutate });
    const { onOpenChange } = renderDialog();

    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: /Create goal/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(screen.queryByText('A goal with this name already exists')).not.toBeInTheDocument();
    expect(screen.queryByTestId('create-savings-goal-error')).not.toBeInTheDocument();
  });
});
