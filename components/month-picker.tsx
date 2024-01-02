'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, addYears, eachMonthOfInterval, format } from 'date-fns';
import * as React from 'react';
import {
  type DateRange,
  type DayPickerBase,
  type DayPickerDefaultProps,
  type DayPickerMultipleProps,
  type DayPickerRangeProps,
  type DayPickerSingleProps,
  type DaySelectionMode,
  MonthChangeEventHandler,
} from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/utils/cn';

export interface MonthPickerProps {
  defaultMonth?: Date;
  month: Date;
  onMonthChange: MonthChangeEventHandler;
}

const CURRENT_YEAR = new Date().getFullYear();
const MONTHS = eachMonthOfInterval({
  start: new Date(CURRENT_YEAR, 0),
  end: new Date(CURRENT_YEAR, 11),
});

const rows = MONTHS.reduce<Date[][]>((accumulator, month, index: number) => {
  if (index % 3 === 0) {
    // If index is even, create a new subarray
    accumulator.push([month]);
  } else {
    // If index is odd, push the month to the last subarray
    accumulator[accumulator.length - 1].push(month);
  }
  return accumulator;
}, []);

function MonthCalendar({ month, onMonthChange, ...props }: MonthPickerProps) {
  console.log(month);

  const [year, setYear] = React.useState(month);

  return (
    <div className='p-3'>
      <div className='flex flex-col space-y-4 sm:space-x-4 sm:space-y-0'>
        <div className='space-y-4 grow'>
          <div className='flex justify-center pt-1 relative items-center px-10'>
            <div
              className='items-center text-center gap-2 text-sm font-medium min-w-[144px]'
              aria-live='polite'
              role='presentation'
            >
              {format(year, 'yyyy')}
            </div>
            <div className='space-x-1 flex items-center'>
              <button
                name='previous-month'
                aria-label='Go to previous month'
                className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1'
                type='button'
                onClick={() => setYear(addYears(year, -1))}
              >
                {/* Left button */}
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                >
                  <path
                    d='M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z'
                    fill='currentColor'
                    fillRule='evenodd'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
              <button
                name='next-month'
                aria-label='Go to next month'
                className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1'
                type='button'
                onClick={() => setYear(addYears(year, 1))}
              >
                {/* Right button */}
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                >
                  <path
                    d='M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z'
                    fill='currentColor'
                    fillRule='evenodd'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <table
            className='w-full border-collapse space-y-1'
            role='grid'
            aria-labelledby='react-day-picker-47'
          >
            <tbody className='rdp-tbody'>
              {rows.map((col, index) => (
                <tr key={index} className='flex w-full mt-2'>
                  {col.map((m) => (
                    <td
                      key={m.getMonth()}
                      className='grow relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&amp;:has([aria-selected].day-outside)]:bg-accent/50 [&amp;:has([aria-selected].day-range-end)]:rounded-r-md [&amp;:has([aria-selected])]:rounded-md'
                      role='presentation'
                    >
                      <button
                        name='day'
                        className={cn(
                          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-full p-0 font-normal aria-selected:opacity-100',
                          m.getMonth() === month.getMonth() &&
                            year.getFullYear() === month.getFullYear() &&
                            'bg-accent text-accent-foreground'
                        )}
                        role='gridcell'
                        tabIndex={-1}
                        type='button'
                        onClick={() =>
                          onMonthChange(
                            new Date(year.getFullYear(), m.getMonth(), 1)
                          )
                        }
                      >
                        {format(m, 'MMM')}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function MonthPicker({ month, onMonthChange }: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal',
              !month && 'text-muted-foreground'
            )}
          >
            {month ? format(month, 'MMMM yyyy') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <MonthCalendar month={month} onMonthChange={onMonthChange} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !month && 'text-muted-foreground'
          )}
        >
          {month ? format(month, 'MMMM yyyy') : <span>Pick a date</span>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <MonthCalendar month={month} onMonthChange={onMonthChange} />

        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
