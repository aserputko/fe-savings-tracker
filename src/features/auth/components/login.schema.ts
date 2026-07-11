import { z } from 'zod';

const emailField = z
  .string()
  .min(1, 'Email is required')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address');

const passwordField = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters');

export const LoginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export interface LoginFormValues {
  email: string;
  password: string;
}

export type LoginFormOutput = z.output<typeof LoginSchema>;

export const loginDefaults: LoginFormValues = {
  email: '',
  password: '',
};
