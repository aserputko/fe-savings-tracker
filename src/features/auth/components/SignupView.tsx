import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Logo } from '@/shared/components/ui/logo/logo';
import { useSignup } from '../hooks/useSignup';
import { setToken } from '../lib/token';
import { AuthQuote } from './AuthQuote';

interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
}

export function SignupView() {
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const onSubmit = (data: SignupFormValues) => {
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
      <div className='flex flex-1 items-center justify-center p-8 lg:flex-none lg:w-[640px] lg:p-0 bg-neutral-900'>
        <div className='w-full mb-10'>
          <Logo className='mb-10' />
          <h1 className='text-2xl font-semibold text-neutral-0 tracking-[-0.5px] mb-8'>
            Create an account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-5'>
            <Input
              label='Full Name'
              placeholder=''
              required
              variant={errors.fullName ? 'error' : 'default'}
              errorText={errors.fullName?.message}
              {...register('fullName', { required: 'Full name is required' })}
            />

            <Input
              label='Email'
              type='email'
              placeholder=''
              required
              variant={errors.email ? 'error' : 'default'}
              errorText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />

            <Input
              label='Password'
              type='password'
              placeholder=''
              required
              variant={errors.password ? 'error' : 'default'}
              errorText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />

            {error && (
              <p className='text-sm font-medium text-red-500'>
                Something went wrong. Please try again.
              </p>
            )}

            <Button type='submit' variant='primary' className='w-full mt-1' disabled={isPending}>
              {isPending ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

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
