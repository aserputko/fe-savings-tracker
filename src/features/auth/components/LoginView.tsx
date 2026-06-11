import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Logo } from '@/shared/components/ui/logo/logo';
import { useLogin } from '../hooks/useLogin';
import { setToken } from '../lib/token';
import { AuthQuote } from './AuthQuote';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginView() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: (response) => {
        setToken(response.access_token);
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-neutral-900 lg:pl-10 lg:pr-20 lg:py-10 lg:gap-20">
      {/* Orange decorative panel — desktop only */}
      <AuthQuote />

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-8 lg:flex-none lg:w-[640px] lg:p-0 bg-neutral-900">
        <div className="w-full mb-10">
          <Logo className='mb-10' />
          <h1 className="text-preset-2 text-neutral-0 mb-2">
            Welcome back
          </h1>
          <p className="text-preset-5 text-neutral-300">Sign in to your account</p>

          <hr className="my-8 border-neutral-700" />

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              placeholder=""
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
              label="Password"
              type="password"
              placeholder=""
              required
              variant={errors.password ? 'error' : 'default'}
              errorText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />

            {error && (
              <p className="text-sm font-medium text-red-500">
                Something went wrong. Please try again.
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full mt-3" disabled={isPending}>
              {isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-preset-5 text-neutral-300 text-center mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-neutral-0 underline underline-offset-2 hover:text-orange-400">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
