'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import * as React from 'react';
import {
  type DateRange,
  type DayPickerBase,
  type DayPickerDefaultProps,
  type DayPickerMultipleProps,
  type DayPickerRangeProps,
  type DayPickerSingleProps,
  type DaySelectionMode,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/utils/cn';

export interface DayPickerProps<T extends DaySelectionMode = DaySelectionMode>
  extends DayPickerBase {
  mode?: T;
  selected?: T extends 'single'
    ? DayPickerSingleProps['selected']
    : T extends 'multiple'
      ? DayPickerMultipleProps['selected']
      : T extends 'range'
        ? DayPickerRangeProps['selected']
        : DayPickerDefaultProps['selected'];
  onSelect?: T extends 'single'
    ? DayPickerSingleProps['onSelect']
    : T extends 'multiple'
      ? DayPickerMultipleProps['onSelect']
      : T extends 'range'
        ? DayPickerRangeProps['onSelect']
        : never;
  required?: T extends 'single' ? DayPickerSingleProps['required'] : never;
  min?: T extends 'multiple'
    ? DayPickerMultipleProps['min']
    : T extends 'range'
      ? DayPickerRangeProps['min']
      : never;
  max?: T extends 'multiple'
    ? DayPickerMultipleProps['max']
    : T extends 'range'
      ? DayPickerRangeProps['max']
      : never;
}

function formatDate(mode: DaySelectionMode, date: DayPickerProps['selected']) {
  if (mode === 'single' && date instanceof Date) {
    return format(date as Date, 'PPP');
  } else if (mode === 'multiple' && Array.isArray(date) && date.length > 0) {
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
  }
}

export function DatePicker<T extends DaySelectionMode = 'default'>({
  mode,
  selected: date,
  onSelect: setDate,
  ...props
}: DayPickerProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [formattedDate, setFormattedDate] = React.useState<
    string | undefined
  >();

  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {
    if (mode) setFormattedDate(formatDate(mode, date));
  }, [mode, date]);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] justify-start overflow-hidden whitespace-nowrap text-left align-middle font-normal',
              (!date || (Array.isArray(date) && date.length <= 0)) &&
                'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            <span className='truncate'>
              {formattedDate ? formattedDate : <span>Pick a date</span>}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='start'
          className='flex w-auto flex-col space-y-2 p-2'
        >
          {mode === 'single' && setDate ? (
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
          <span className='truncate'>
            {formattedDate ? formattedDate : <span>Pick a date</span>}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {mode === 'single' && setDate ? (
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
