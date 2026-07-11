interface AuthErrorBannerProps {
  error: unknown;
}

export function AuthErrorBanner({ error }: AuthErrorBannerProps) {
  if (!error) return null;

  return (
    <p className='text-sm font-medium text-red-500'>Something went wrong. Please try again.</p>
  );
}
