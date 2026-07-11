import { z } from 'zod';

export const CreateSavingsGoalSchema = z.object({
  name: z
    .string()
    .min(1, 'Goal name is required')
    .max(256, 'Goal name must not exceed 256 characters'),
  targetAmount: z
    .string()
    .min(1, 'Target amount is required')
    .transform((value, ctx) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Target amount must be a positive number',
        });
        return z.NEVER;
      }
      if (parsed === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Target amount is required',
        });
        return z.NEVER;
      }
      if (parsed < 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Target amount must be a positive number',
        });
        return z.NEVER;
      }
      const decimalPart = value.includes('.') ? value.split('.')[1] : '';
      if (decimalPart.length > 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Target amount must have at most 2 decimal places',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  deadline: z.string().transform((value, ctx) => {
    if (value === '') return undefined;
    const [year, month, day] = value.split('-').map(Number);
    const chosen = new Date(year, month - 1, day);
    chosen.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (chosen.getTime() < today.getTime()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Deadline must not be in the past',
      });
      return z.NEVER;
    }
    return value;
  }),
});

export interface CreateSavingsGoalFormValues {
  name: string;
  targetAmount: string;
  deadline: string;
}

export type CreateSavingsGoalFormOutput = z.output<typeof CreateSavingsGoalSchema>;

export const createSavingsGoalDefaults: CreateSavingsGoalFormValues = {
  name: '',
  targetAmount: '',
  deadline: '',
};
