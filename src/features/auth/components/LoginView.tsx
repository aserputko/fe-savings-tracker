import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useLogin } from '../hooks/useLogin';
import { setToken } from '../lib/token';

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
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Orange decorative panel — desktop only */}
      <div className="hidden lg:block lg:w-1/2 bg-orange-400" />

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-neutral-900">
        <div className="w-full max-w-100">
          <h1 className="text-2xl font-semibold text-neutral-0 tracking-[-0.5px] mb-8">
            Welcome back
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <Input
              label="Email"
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

            <Button type="submit" variant="primary" className="w-full mt-1" disabled={isPending}>
              {isPending ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-300">
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
