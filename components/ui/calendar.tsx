'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { type DayPickerProps } from '@/components/date-picker';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CalendarProps = DayPickerProps;
const MyDayPicker = DayPicker as React.ComponentType<CalendarProps>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { numberOfMonths } = props;

  return (
    <MyDayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: cn(
          'flex flex-col space-y-4 sm:space-x-4 sm:space-y-0',
          numberOfMonths && numberOfMonths > 1 ? 'sm:flex-row' : ''
        ),
        month: 'space-y-4 grow',
        caption: 'flex justify-center pt-1 relative items-center px-10',
        caption_label: 'flex items-center gap-2 text-sm font-medium',
        caption_dropdowns: 'flex gap-4 [&_.rdp-vhidden]:hidden',
        dropdown_month: 'relative inline-flex items-center',
        dropdown_year: 'relative inline-flex items-center',
        dropdown:
          'absolute inset-0 w-full appearance-none opacity-0 z-10 cursor-pointer',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'grow text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative grow p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className='h-4 w-4' />,
        IconRight: () => <ChevronRightIcon className='h-4 w-4' />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };