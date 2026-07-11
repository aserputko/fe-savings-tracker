import { z } from 'zod';

export const SignupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
}

export type SignupFormOutput = z.output<typeof SignupSchema>;

export const signupDefaults: SignupFormValues = {
  fullName: '',
  email: '',
  password: '',
};
