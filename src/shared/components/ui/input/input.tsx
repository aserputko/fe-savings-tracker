import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui/icons';
import type { IconName } from '@/shared/components/ui/icons/icon-map';

const inputWrapperVariants = cva(
  [
    'bg-neutral-700 border flex items-center gap-3',
    'h-[54px] w-full px-4 rounded-lg',
    'transition-colors',
    'focus-within:shadow-[0px_0px_0px_2px_var(--color-neutral-800),0px_0px_0px_4px_var(--color-orange-400)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: ['border-neutral-500', 'hover:bg-neutral-600'].join(' '),
        error: ['border-red-500', 'hover:bg-neutral-600'].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputWrapperVariants> {
  label?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  errorText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      label,
      leftIcon,
      rightIcon,
      onRightIconClick,
      errorText,
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn('flex flex-col gap-2.5', disabled && 'opacity-50 pointer-events-none')}>
        {label !== undefined && (
          <label className='text-base font-medium text-neutral-0 leading-normal tracking-[-0.3px]'>
            {label}
            {!required && <span> (optional)</span>}
          </label>
        )}
        <div className={cn(inputWrapperVariants({ variant, className }))}>
          {leftIcon && <Icon name={leftIcon} />}
          <input
            ref={ref}
            disabled={disabled}
            required={required}
            className={cn(
              'flex-1 bg-transparent outline-none',
              'text-base font-medium text-neutral-0 leading-normal tracking-[-0.3px]',
              'placeholder:text-neutral-300',
            )}
            {...props}
          />
          {rightIcon &&
            (onRightIconClick ? (
              <button
                type='button'
                onClick={onRightIconClick}
                disabled={disabled}
                tabIndex={-1}
                aria-label={rightIcon}
                className='flex items-center justify-center focus-visible:outline-none'
              >
                <Icon name={rightIcon} />
              </button>
            ) : (
              <Icon name={rightIcon} />
            ))}
        </div>
        {errorText && (
          <div className='flex items-center gap-2'>
            <Icon name='error' />
            <p className='text-[14px] font-medium text-red-500 leading-[1.4] tracking-[-0.3px]'>
              {errorText}
            </p>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
