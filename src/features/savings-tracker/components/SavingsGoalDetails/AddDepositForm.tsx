import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import type { SavingsGoalResponseDto } from '../../../../api/generated';
import { useAddGoalDeposit } from '../../hooks';
import {
  AddDepositSchema,
  addDepositDefaults,
  type AddDepositFormOutput,
  type AddDepositFormValues,
} from './addDeposit.schema';

interface AddDepositFormProps {
  goal: SavingsGoalResponseDto;
}

function AddDepositErrorBanner() {
  const {
    formState: { errors },
  } = useFormContext<AddDepositFormValues>();
  const message = errors.root?.serverError?.message;

  if (!message) return null;

  return (
    <p className='text-[14px] font-medium text-red-500 leading-[1.4] tracking-[-0.3px]'>
      {message}
    </p>
  );
}

export function AddDepositForm({ goal }: AddDepositFormProps) {
  const { mutate, isPending } = useAddGoalDeposit();

  const methods = useForm<AddDepositFormValues, unknown, AddDepositFormOutput>({
    resolver: zodResolver(AddDepositSchema),
    defaultValues: addDepositDefaults,
    mode: 'onSubmit',
  });

  const { control, handleSubmit, reset, setError, clearErrors } = methods;

  function onSubmit(values: AddDepositFormOutput) {
    clearErrors('root.serverError');
    mutate(
      {
        goalId: goal.id,
        amount: values.amount,
        note: values.note,
      },
      {
        onSuccess: () => {
          reset(addDepositDefaults);
        },
        onError: (error: unknown) => {
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status === 422) {
            setError('amount', { message: 'Amount exceeds remaining balance' });
          } else {
            setError('root.serverError', {
              type: 'server',
              message: 'Something went wrong. Please try again.',
            });
          }
        },
      },
    );
  }

  return (
    <div className='bg-neutral-800 border border-neutral-600 rounded-2xl p-6 flex flex-col gap-6 w-full'>
      <h2 className='text-preset-4 text-neutral-0'>Add deposit</h2>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-6'>
          <div className='flex flex-col gap-5'>
            <Controller
              name='amount'
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label='Amount'
                  type='number'
                  min={0.01}
                  step='any'
                  placeholder='0.00'
                  leftIcon='dollar'
                  required
                  variant={fieldState.invalid ? 'error' : 'default'}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='note'
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label='Note'
                  placeholder='e.g. Monthly savings'
                  variant={fieldState.invalid ? 'error' : 'default'}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </div>

          <AddDepositErrorBanner />

          <Button variant='primary' type='submit' disabled={isPending} className='w-full'>
            Add funds
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
