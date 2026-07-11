import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Logo } from '@/shared/components/ui/logo/logo';
import { useSignup } from '../hooks/useSignup';
import { setToken } from '../lib/token';
import { AuthErrorBanner } from './AuthErrorBanner';
import { AuthQuote } from './AuthQuote';
import {
  SignupSchema,
  signupDefaults,
  type SignupFormOutput,
  type SignupFormValues,
} from './signup.schema';

export function SignupView() {
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useSignup();

  const methods = useForm<SignupFormValues, unknown, SignupFormOutput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: signupDefaults,
    mode: 'onSubmit',
  });

  const { control, handleSubmit } = methods;

  const onSubmit = (data: SignupFormOutput) => {
    signup(data, {
      onSuccess: (response) => {
        setToken(response.access_token);
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className='flex min-h-screen flex-col lg:flex-row bg-neutral-900 lg:pl-10 lg:pr-20 lg:py-10 lg:gap-20 mx-auto max-w-[1440px]'>
      {/* Orange decorative panel — desktop only */}
      <AuthQuote />

      {/* Form panel */}
      <div className='flex flex-1 items-center justify-center p-4 md:p-16 lg:p-0 bg-neutral-900'>
        <div className='w-full'>
          <Logo className='mb-10' />
          <h1 className='text-preset-2 text-neutral-0 mb-1'>Create your account</h1>
          <p className='text-preset-5 text-neutral-300 mb-8'>Start tracking your savings goals</p>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-5'>
              <Controller
                name='fullName'
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label='Full name'
                    placeholder=''
                    required
                    variant={fieldState.invalid ? 'error' : 'default'}
                    errorText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name='email'
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label='Email address'
                    type='email'
                    placeholder=''
                    required
                    variant={fieldState.invalid ? 'error' : 'default'}
                    errorText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name='password'
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label='Password'
                    type='password'
                    placeholder=''
                    required
                    variant={fieldState.invalid ? 'error' : 'default'}
                    errorText={fieldState.error?.message}
                  />
                )}
              />

              <AuthErrorBanner error={error} />

              <Button type='submit' variant='primary' className='w-full mt-1' disabled={isPending}>
                {isPending ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          </FormProvider>

          <p className='mt-6 text-center text-sm text-neutral-300'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-neutral-0 underline underline-offset-2 hover:text-orange-400'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
