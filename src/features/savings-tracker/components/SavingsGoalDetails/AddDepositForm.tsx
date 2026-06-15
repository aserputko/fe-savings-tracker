import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import type { SavingsGoalResponseDto } from '../../../../api/generated';
import { useAddGoalDeposit } from '../../hooks';

interface AddDepositFormProps {
  goal: SavingsGoalResponseDto;
}

interface FormValues {
  amount: string;
  note: string;
}

export function AddDepositForm({ goal }: AddDepositFormProps) {
  const { mutate, isPending } = useAddGoalDeposit();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { amount: '', note: '' } });

  function onSubmit(values: FormValues) {
    setFormError(null);
    mutate(
      {
        goalId: goal.id,
        amount: Number(values.amount),
        note: values.note || undefined,
      },
      {
        onSuccess: () => {
          reset();
        },
        onError: (error: unknown) => {
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status === 422) {
            setError('amount', { message: 'Amount exceeds remaining balance' });
          } else {
            setFormError('Something went wrong. Please try again.');
          }
        },
      },
    );
  }

  return (
    <div className='bg-neutral-800 border border-neutral-600 rounded-2xl p-6 flex flex-col gap-6 w-full'>
      <h2 className='text-preset-4 text-neutral-0'>Add deposit</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-6'>
        <div className='flex flex-col gap-5'>
          <Input
            label='Amount'
            type='number'
            min={0.01}
            step='any'
            placeholder='0.00'
            leftIcon='dollar'
            required
            variant={errors.amount ? 'error' : 'default'}
            errorText={errors.amount?.message}
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be a positive number' },
              validate: {
                decimals: (v) => {
                  if (!v) return true;
                  const parts = String(v).split('.');
                  return (
                    parts.length < 2 ||
                    parts[1].length <= 2 ||
                    'Amount must have at most 2 decimal places'
                  );
                },
              },
            })}
          />
          <Input
            label='Note'
            placeholder='e.g. Monthly savings'
            errorText={errors.note?.message}
            {...register('note', {
              maxLength: {
                value: 1024,
                message: 'Note must not exceed 1024 characters',
              },
            })}
          />
        </div>

        {formError && (
          <p className='text-[14px] font-medium text-red-500 leading-[1.4] tracking-[-0.3px]'>
            {formError}
          </p>
        )}

        <Button variant='primary' type='submit' disabled={isPending} className='w-full'>
          Add funds
        </Button>
      </form>
    </div>
  );
}
