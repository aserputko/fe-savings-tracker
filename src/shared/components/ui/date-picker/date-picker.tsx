import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import * as React from 'react';
import type { Matcher } from 'react-day-picker';

import { Input, type InputProps } from '@/shared/components/ui/input';

import { DatePickerCalendar } from './date-picker-calendar';
import { formatDateValue } from './date-picker.utils';

export interface DatePickerProps extends Omit<
  InputProps,
  'value' | 'onChange' | 'type' | 'rightIcon' | 'onRightIconClick' | 'readOnly' | 'defaultValue'
> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  format?: string;
  placeholder?: string;
  disabledDates?: Matcher | Matcher[];
  hiddenDates?: Matcher | Matcher[];
  defaultMonth?: Date;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      format: valueFormat = 'dd/MM/yyyy',
      placeholder = 'Select a date',
      disabledDates,
      hiddenDates,
      defaultMonth,
      disabled,
      ...inputProps
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: 'bottom-start',
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(8),
        flip({ fallbackPlacements: ['top-start', 'bottom-end', 'top-end'] }),
        shift({ padding: 8 }),
      ],
    });

    const click = useClick(context, { enabled: !disabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'dialog' });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    const handleSelect = React.useCallback(
      (date: Date | undefined) => {
        onChange?.(date);
        if (date) setIsOpen(false);
      },
      [onChange],
    );

    // When the popover is open, capture Escape at the window capture phase (which fires
    // before any document-level listeners such as Radix Dialog's DismissableLayer) and
    // close only the popover, preventing the outer modal from also closing on the same
    // Escape press.
    React.useEffect(() => {
      if (!isOpen) return;
      const handler = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        event.stopPropagation();
        event.stopImmediatePropagation();
        setIsOpen(false);
      };
      window.addEventListener('keydown', handler, true);
      return () => window.removeEventListener('keydown', handler, true);
    }, [isOpen]);

    const displayValue = formatDateValue(value, valueFormat);

    return (
      <>
        <div ref={refs.setReference} {...getReferenceProps()}>
          <Input
            {...inputProps}
            ref={ref}
            disabled={disabled}
            readOnly
            value={displayValue}
            placeholder={placeholder}
            rightIcon='calendar'
          />
        </div>
        {isOpen && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className='z-60 pointer-events-auto'
            >
              <DatePickerCalendar
                selected={value}
                defaultMonth={defaultMonth}
                onSelect={handleSelect}
                disabledDates={disabledDates}
                hiddenDates={hiddenDates}
              />
            </div>
          </FloatingPortal>
        )}
      </>
    );
  },
);

DatePicker.displayName = 'DatePicker';
