import * as React from 'react';
import { DayPicker, type Matcher, SelectionState, UI } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui/icons';

import 'react-day-picker/style.css';

export interface DatePickerCalendarProps {
  selected?: Date;
  defaultMonth?: Date;
  onSelect: (date: Date | undefined) => void;
  disabledDates?: Matcher | Matcher[];
  hiddenDates?: Matcher | Matcher[];
}

const dayPickerClassNames = {
  [UI.Root]: 'text-neutral-0',
  [UI.Months]: 'flex flex-col',
  [UI.Month]: 'flex flex-col gap-3',
  [UI.MonthCaption]: 'flex items-center justify-center h-9',
  [UI.CaptionLabel]:
    'text-base font-medium text-neutral-0 leading-normal tracking-[-0.3px] capitalize',
  [UI.Nav]: '',
  [UI.PreviousMonthButton]:
    'absolute left-2 top-2 inline-flex items-center justify-center size-9 rounded-full text-neutral-300 hover:bg-neutral-700 hover:text-neutral-0 focus-visible:outline-none focus-visible:shadow-[0px_0px_0px_2px_var(--color-neutral-800),0px_0px_0px_4px_var(--color-orange-400)] disabled:opacity-40 disabled:pointer-events-none transition-colors',
  [UI.NextMonthButton]:
    'absolute right-2 top-2 inline-flex items-center justify-center size-9 rounded-full text-neutral-300 hover:bg-neutral-700 hover:text-neutral-0 focus-visible:outline-none focus-visible:shadow-[0px_0px_0px_2px_var(--color-neutral-800),0px_0px_0px_4px_var(--color-orange-400)] disabled:opacity-40 disabled:pointer-events-none transition-colors',
  [UI.MonthGrid]: 'w-full border-collapse',
  [UI.Weekdays]: 'flex',
  [UI.Weekday]:
    'flex-1 text-[13px] font-medium text-neutral-300 leading-normal tracking-[-0.3px] text-center pb-1',
  [UI.Weeks]: '',
  [UI.Week]: 'flex w-full mt-1',
  [UI.Day]: 'flex-1 aspect-square p-0 text-center',
  [UI.DayButton]:
    'size-9 mx-auto inline-flex items-center justify-center rounded-full text-base font-medium text-neutral-0 leading-normal tracking-[-0.3px] hover:bg-neutral-700 focus-visible:outline-none focus-visible:shadow-[0px_0px_0px_2px_var(--color-neutral-800),0px_0px_0px_4px_var(--color-orange-400)] transition-colors',
  today: '[&_button]:text-orange-400 [&_button]:font-semibold',
  outside: '[&_button]:text-neutral-400',
  disabled: '[&_button]:text-neutral-400 [&_button]:opacity-50 [&_button]:pointer-events-none',
  [SelectionState.selected]:
    '[&_button]:bg-orange-400 [&_button]:text-neutral-900 [&_button:hover]:bg-orange-500',
};

function ChevronLeftButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type='button' {...props}>
      <Icon name='chevron-left' />
    </button>
  );
}

function ChevronRightButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type='button' {...props}>
      <Icon name='chevron-right' />
    </button>
  );
}

export function DatePickerCalendar({
  selected,
  defaultMonth,
  onSelect,
  disabledDates,
  hiddenDates,
}: DatePickerCalendarProps) {
  return (
    <div className={cn('bg-neutral-800 border border-neutral-600 rounded-2xl p-4 shadow-2xl')}>
      <DayPicker
        mode='single'
        selected={selected}
        onSelect={onSelect}
        defaultMonth={defaultMonth ?? selected}
        disabled={disabledDates}
        hidden={hiddenDates}
        showOutsideDays
        navLayout='around'
        classNames={dayPickerClassNames}
        components={{
          PreviousMonthButton: ChevronLeftButton,
          NextMonthButton: ChevronRightButton,
        }}
      />
    </div>
  );
}
