'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import * as React from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateState } from '@/hooks/use-dates-state';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/utils/cn';
import {
  type DateRange,
  DayPicker,
  type DaySelectionMode,
} from 'react-day-picker';

export type DatePickerProps = React.ComponentProps<typeof DayPicker> & {
  mode?: DaySelectionMode;
  value: DateState;
  onChange:
    | React.Dispatch<React.SetStateAction<Date>>
    | React.Dispatch<React.SetStateAction<Date[]>>
    | React.Dispatch<React.SetStateAction<DateRange>>;
};

function formatDate(mode: DaySelectionMode, date: DateState) {
  if (mode === 'single' && date instanceof Date) {
    return format(date as Date, 'PPP');
  } else if (mode === 'multiple' && Array.isArray(date)) {
    // Assuming date is an array of Date objects
    const dates = date as Date[];
    return dates.map((date) => format(date, 'PP')).join(', ');
  } else if (mode === 'range' && date instanceof Object) {
    // Assuming date is an object with 'from' and 'to' Date properties
    const range = date as DateRange;

    if (range?.from) {
      if (range.to) {
        return `${format(range.from, 'LLL dd, y')} - ${format(
          range.to,
          'LLL dd, y'
        )}`;
      }

      return format(range.from, 'LLL dd, y');
    }
  } else {
    return <span>Pick a date</span>;
  }
}

export function DatePicker({
  mode = 'single',
  value: date,
  onChange: setDate,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const formattedDate = formatDate(mode, date);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] justify-start overflow-hidden whitespace-nowrap text-left align-middle font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            <span className='truncate'>{formattedDate}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='start'
          className='flex w-auto flex-col space-y-2 p-2'
        >
          {mode === 'single' ? (
            <Select
              onValueChange={(value) =>
                // setDate should only be React.Dispatch<React.SetStateAction<Date>> here
                (setDate as React.Dispatch<React.SetStateAction<Date>>)(
                  addDays(new Date(), parseInt(value))
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent position='popper'>
                <SelectItem value='0'>Today</SelectItem>
                <SelectItem value='1'>Tomorrow</SelectItem>
                <SelectItem value='3'>In 3 days</SelectItem>
                <SelectItem value='7'>In a week</SelectItem>
              </SelectContent>
            </Select>
          ) : null}

          <div className='rounded-md border'>
            <Calendar
              initialFocus
              mode={mode}
              selected={date}
              /* @ts-ignore  */
              onSelect={setDate}
              {...props}
            />
          </div>
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
            'w-[240px] justify-start overflow-hidden whitespace-nowrap text-left align-middle font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          <span className='truncate'>{formattedDate}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {mode === 'single' ? (
          <DrawerHeader className='text-left'>
            <Select
              onValueChange={(value) =>
                (setDate as React.Dispatch<React.SetStateAction<Date>>)(
                  addDays(new Date(), parseInt(value))
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent position='popper'>
                <SelectItem value='0'>Today</SelectItem>
                <SelectItem value='1'>Tomorrow</SelectItem>
                <SelectItem value='3'>In 3 days</SelectItem>
                <SelectItem value='7'>In a week</SelectItem>
              </SelectContent>
            </Select>
          </DrawerHeader>
        ) : null}

        <Calendar
          initialFocus
          mode={mode}
          selected={date}
          /* @ts-ignore  */
          onSelect={setDate}
          {...props}
        />

        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
