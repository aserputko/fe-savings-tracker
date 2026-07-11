import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

import { useCreateSavingsGoal } from '../../hooks';
import {
  CreateSavingsGoalSchema,
  createSavingsGoalDefaults,
  type CreateSavingsGoalFormOutput,
  type CreateSavingsGoalFormValues,
} from './createSavingsGoal.schema';

interface CreateSavingsGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = 'create-savings-goal-form';

interface SubmitButtonProps {
  isPending: boolean;
}

function CreateSavingsGoalSubmitButton({ isPending }: SubmitButtonProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext<CreateSavingsGoalFormValues>();
  const disabled = isPending || isSubmitting;

  return (
    <Button variant='primary' type='submit' form={FORM_ID} disabled={disabled}>
      {disabled ? 'Creating…' : 'Create goal'}
    </Button>
  );
}

export function CreateSavingsGoalDialog({ open, onOpenChange }: CreateSavingsGoalDialogProps) {
  const { mutate, isPending } = useCreateSavingsGoal();

  const methods = useForm<CreateSavingsGoalFormValues, unknown, CreateSavingsGoalFormOutput>({
    resolver: zodResolver(CreateSavingsGoalSchema),
    defaultValues: createSavingsGoalDefaults,
    mode: 'onSubmit',
  });

  const { control, handleSubmit, reset } = methods;

  useEffect(() => {
    if (!open) {
      reset(createSavingsGoalDefaults);
    }
  }, [open, reset]);

  function onSubmit(values: CreateSavingsGoalFormOutput) {
    mutate(
      {
        name: values.name,
        targetAmount: values.targetAmount,
        deadline: values.deadline,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title='New goal'
        footer={
          <>
            <Button variant='secondary' type='button' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <CreateSavingsGoalSubmitButton isPending={isPending} />
          </>
        }
      >
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className='flex flex-col gap-5'>
            <Controller
              name='name'
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  required
                  label='Goal name'
                  placeholder='e.g. MacBook Pro M4'
                  variant={fieldState.invalid ? 'error' : 'default'}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='targetAmount'
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  required
                  label='Target amount'
                  type='number'
                  min={0.01}
                  step='any'
                  leftIcon='dollar'
                  placeholder='0.00'
                  variant={fieldState.invalid ? 'error' : 'default'}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='deadline'
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label='Deadline'
                  type='date'
                  leftIcon='calendar'
                  variant={fieldState.invalid ? 'error' : 'default'}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </div>
        </form>
      </Dialog>
    </FormProvider>
  );
}
