import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui/icons';
import type { IconName } from '@/shared/components/ui/icons/icon-map';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full',
    'h-12 min-w-[120px] px-5 py-3',
    'text-base font-medium leading-[1.5] tracking-[-0.3px]',
    'transition-colors focus-visible:outline-none',
    'disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-orange-400 text-neutral-900',
          'hover:bg-orange-500',
          'focus-visible:bg-orange-400 focus-visible:shadow-[0px_0px_0px_2px_var(--color-neutral-900),0px_0px_0px_4px_var(--color-orange-400)]',
          'active:bg-orange-400 active:shadow-[0px_0px_0px_2px_var(--color-neutral-900),0px_0px_0px_4px_var(--color-orange-400)]',
          'disabled:opacity-50 disabled:shadow-none',
        ].join(' '),
        secondary: [
          'bg-neutral-800 border border-neutral-600 text-neutral-0',
          'hover:bg-neutral-700',
          'focus-visible:bg-neutral-800 focus-visible:shadow-[0px_0px_0px_2px_var(--color-neutral-900),0px_0px_0px_4px_var(--color-orange-400)]',
          'active:bg-neutral-800 active:shadow-[0px_0px_0px_2px_var(--color-neutral-900),0px_0px_0px_4px_var(--color-orange-400)]',
          'disabled:text-neutral-400 disabled:shadow-none',
        ].join(' '),
        tertiary: [
          'bg-neutral-600 text-neutral-0',
          'hover:bg-neutral-800',
          'focus-visible:bg-neutral-900 focus-visible:shadow-[0px_0px_0px_2px_var(--color-neutral-900),0px_0px_0px_4px_var(--color-orange-400)]',
          'active:bg-neutral-900 active:shadow-[0px_0px_0px_2px_var(--color-neutral-900),0px_0px_0px_4px_var(--color-orange-400)]',
          'disabled:opacity-50 disabled:shadow-none',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  iconClass?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, asChild = false, leftIcon, rightIcon, iconClass, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, className }))} ref={ref} {...props}>
        {leftIcon && <Icon name={leftIcon} className={iconClass} />}
        <Slottable>{children}</Slottable>
        {rightIcon && <Icon name={rightIcon} className={iconClass} />}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
