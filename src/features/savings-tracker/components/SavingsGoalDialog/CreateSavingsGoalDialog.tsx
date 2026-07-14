import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';

import { ResponseError } from '@/api/generated';
import { Button } from '@/shared/components/ui/button';
import { DatePicker } from '@/shared/components/ui/date-picker';
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
  const [genericError, setGenericError] = useState<string | null>(null);

  const methods = useForm<CreateSavingsGoalFormValues, unknown, CreateSavingsGoalFormOutput>({
    resolver: zodResolver(CreateSavingsGoalSchema),
    defaultValues: createSavingsGoalDefaults,
    mode: 'onSubmit',
  });

  const { control, handleSubmit, reset, setError } = methods;

  useEffect(() => {
    if (!open) {
      reset(createSavingsGoalDefaults);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGenericError(null);
    }
  }, [open, reset]);

  function onSubmit(values: CreateSavingsGoalFormOutput) {
    setGenericError(null);
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
        onError: (error) => {
          if (error instanceof ResponseError && error.response.status === 409) {
            setError('name', {
              type: 'server',
              message: 'A goal with this name already exists',
            });
            return;
          }
          setGenericError('Something went wrong. Please try again.');
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
          <div className='flex w-full flex-col gap-3'>
            {genericError && (
              <p
                role='alert'
                data-testid='create-savings-goal-error'
                className='text-preset-4 text-red-500 text-right'
              >
                {genericError}
              </p>
            )}
            <div className='flex items-center justify-end gap-4'>
              <Button variant='secondary' type='button' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <CreateSavingsGoalSubmitButton isPending={isPending} />
            </div>
          </div>
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
                <DatePicker
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  value={field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined}
                  onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                  label='Deadline'
                  placeholder='Select a date'
                  disabledDates={{ before: new Date() }}
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
