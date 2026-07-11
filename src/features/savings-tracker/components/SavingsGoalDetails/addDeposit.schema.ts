import { z } from 'zod';

export const AddDepositSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .transform((value, ctx) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Amount must be a positive number',
        });
        return z.NEVER;
      }
      const decimalPart = value.includes('.') ? value.split('.')[1] : '';
      if (decimalPart.length > 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Amount must have at most 2 decimal places',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  note: z
    .string()
    .max(1024, 'Note must not exceed 1024 characters')
    .transform((value) => (value === '' ? undefined : value)),
});

export interface AddDepositFormValues {
  amount: string;
  note: string;
}

export type AddDepositFormOutput = z.output<typeof AddDepositSchema>;

export const addDepositDefaults: AddDepositFormValues = {
  amount: '',
  note: '',
};
