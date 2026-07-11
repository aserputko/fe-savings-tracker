import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SavingsGoalResponseDto } from '../../../../api/generated';
import { useAddGoalDeposit } from '../../hooks';
import { AddDepositForm } from './AddDepositForm';

vi.mock('../../hooks');

const goal = {
  id: 'goal-1',
  name: 'Car',
  targetAmount: 1000,
  currentAmount: 0,
} as unknown as SavingsGoalResponseDto;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AddDepositForm repro2', () => {
  it('ASYNC onSuccess reset: second submit', async () => {
    const mutate = vi.fn((_payload, opts?: { onSuccess?: () => void }) => {
      setTimeout(() => opts?.onSuccess?.(), 0);
    });
    vi.mocked(useAddGoalDeposit).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useAddGoalDeposit>);

    const { container } = render(<AddDepositForm goal={goal} />);
    const amountInput = container.querySelector('input[name="amount"]') as HTMLInputElement;

    await userEvent.type(amountInput, '50');
    await userEvent.click(screen.getByRole('button', { name: 'Add funds' }));
    await new Promise((r) => setTimeout(r, 10));
    console.log('call0', mutate.mock.calls[0]?.[0], 'dom=', amountInput.value);

    await userEvent.type(amountInput, '30');
    console.log('dom after type=', amountInput.value);
    await userEvent.click(screen.getByRole('button', { name: 'Add funds' }));
    console.log('call1', mutate.mock.calls[1]?.[0], 'dom=', amountInput.value);
    expect(mutate.mock.calls[1][0]).toMatchObject({ amount: 30 });
  });
});
