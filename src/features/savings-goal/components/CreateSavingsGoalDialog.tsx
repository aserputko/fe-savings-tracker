import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

import { useCreateSavingsGoal } from '../hooks/useCreateSavingsGoal';

interface CreateSavingsGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormValues {
  name: string;
  targetAmount: string;
  deadline: string;
}

export function CreateSavingsGoalDialog({ open, onOpenChange }: CreateSavingsGoalDialogProps) {
  const { mutate, isPending } = useCreateSavingsGoal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  function onSubmit(values: FormValues) {
    mutate(
      {
        name: values.name,
        targetAmount: Number(values.targetAmount),
        deadline: values.deadline || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title='New goal'
      footer={
        <>
          <Button variant='secondary' type='button' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant='primary'
            type='submit'
            form='create-savings-goal-form'
            disabled={isPending}
          >
            {isPending ? 'Creating…' : 'Create goal'}
          </Button>
        </>
      }
    >
      <form id='create-savings-goal-form' onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className='flex flex-col gap-5'>
          <Input
            label='Goal name'
            placeholder='e.g. MacBook Pro M4'
            errorText={errors.name?.message}
            {...register('name', { required: 'Goal name is required' })}
          />
          <Input
            label='Target amount'
            type='number'
            min={0.01}
            step='any'
            leftIcon='dollar'
            placeholder='0.00'
            errorText={errors.targetAmount?.message}
            {...register('targetAmount', {
              required: 'Target amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
          />
          <Input
            label='Deadline (optional)'
            type='date'
            leftIcon='calendar'
            errorText={errors.deadline?.message}
            {...register('deadline')}
          />
        </div>
      </form>
    </Dialog>
  );
}
