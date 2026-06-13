import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui/icons';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, title, children, footer, className }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-120',
            'flex flex-col gap-6',
            'bg-neutral-800 border border-neutral-600 rounded-2xl p-8',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            className,
          )}
        >
          {/* Header */}
          <div className='flex items-center justify-between pr-7'>
            <DialogPrimitive.Title className='text-[20px] font-semibold leading-[1.2] tracking-[-0.3px] text-neutral-0'>
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className='absolute right-8 top-8 text-neutral-300 hover:text-neutral-0 focus-visible:outline-none transition-colors'>
              <Icon name='cross' className='size-5' />
              <span className='sr-only'>Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Divider */}
          <div className='h-px w-full bg-neutral-700' />

          {/* Body */}
          {children && <div className='flex flex-col gap-5 w-full'>{children}</div>}

          {/* Footer */}
          {footer && <div className='flex items-center justify-end gap-4 w-full'>{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

Dialog.displayName = 'Dialog';

export { DialogPrimitive as DialogRoot };
