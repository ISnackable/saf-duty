'use client';

import {
  type Interval,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isFriday,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfMonth,
} from 'date-fns';
import { useEffect, useState } from 'react';
import { DayClickEventHandler } from 'react-day-picker';
import { toast } from 'sonner';

import { LoadingButton } from '@/components/loading-button';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tables } from '@/types/supabase';
import { cn } from '@/utils/cn';

export const MAXIMUM_BLOCKOUTS = 12;
const TODAY = new Date();
const DEFAULT_MONTH = addMonths(TODAY, 1);
const MIN_MONTH = startOfMonth(TODAY);
const MAX_MONTH = endOfMonth(addMonths(MIN_MONTH, 2));

interface ManageBlockoutCalendarProps {
  profile: Pick<Tables<'profiles'>, 'max_blockouts' | 'blockout_dates'>;
}

function eachWeekendAndFridayOfMonth(interval: Interval) {
  const dateInterval = eachDayOfInterval(interval);
  const weekends = [];
  const fridays = [];

  let index = 0;
  while (index < dateInterval.length) {
    const date = dateInterval[index++];
    if (isWeekend(date)) weekends.push(date);
    else if (isFriday(date)) fridays.push(date);
  }

  return { weekends, fridays };
}

function countSelectedDates(dates: Date[], currentMonthSelected: Date[]) {
  return dates.filter((d) => currentMonthSelected.some((s) => isSameDay(d, s)))
    .length;
}

export function ManageBlockoutCalendar({
  profile,
}: ManageBlockoutCalendarProps) {
  const [month, setMonth] = useState<Date>(DEFAULT_MONTH);
  const [selectedDays, setSelectedDays] = useState<Date[]>(
    profile.blockout_dates
      ? profile.blockout_dates
          .filter(
            (date) =>
              new Date(date).getTime() >= MIN_MONTH.getTime() &&
              new Date(date).getTime() <= MAX_MONTH.getTime()
          )
          .map((date) => new Date(date))
      : []
  );
  const [disabledDays, setDisabledDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  const maximumBlockouts = profile.max_blockouts || MAXIMUM_BLOCKOUTS;
  const currentMonthSelected = selectedDays.filter((d) =>
    isSameMonth(d, month)
  );

  const updateBlockoutDates = async () => {
    setLoading(true);
    const blockoutDates = selectedDays.map((date) =>
      date.toLocaleDateString('sv-SE')
    );

    const res = await fetch('/api/manage-blockouts', {
      method: 'PUT',
      body: JSON.stringify({
        blockout_dates: blockoutDates,
      }),
    });

    const { status, message } = await res.json();

    if (status === 'error') {
      toast('Failed to update blockout dates.', {
        description: message,
      });
    } else {
      toast('Successfully updated blockout dates.', {
        description: 'You can now close this page.',
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (currentMonthSelected.length >= maximumBlockouts) {
      const start = startOfMonth(month);
      const end = endOfMonth(month);

      toast('You have reached the maximum blockouts for this month.', {
        description:
          'Remove some "less important" blockouts or if you need more blockouts, please contact the person-in-charge.',
      });

      setDisabledDays(
        eachDayOfInterval({ start, end }).filter(
          (d) => !selectedDays.some((s) => isSameDay(d, s))
        )
      );
    } else {
      setDisabledDays([]);
    }
  }, [month, selectedDays, maximumBlockouts, currentMonthSelected.length]);

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    const newSelectedDays = [...selectedDays];

    if (modifiers.selected) {
      const index = selectedDays.findIndex((selectedDay) =>
        isSameDay(day, selectedDay)
      );
      newSelectedDays.splice(index, 1);
    } else {
      const start = startOfMonth(day);
      const end = endOfMonth(day);
      const { weekends, fridays } = eachWeekendAndFridayOfMonth({ start, end });

      const numSelectedWeekends = countSelectedDates(weekends, newSelectedDays);
      const numSelectedFridays = countSelectedDates(fridays, newSelectedDays);

      const canSelectWeekend = numSelectedWeekends < weekends.length - 2;
      const canSelectFriday = numSelectedFridays < fridays.length - 1;

      if (isWeekend(day) && !canSelectWeekend) {
        toast('You have reached the maximum weekends for this month.', {
          description:
            'If you need more blockouts, please contact the person-in-charge.',
        });

        return;
      } else if (isFriday(day) && !canSelectFriday) {
        toast('You have reached the maximum Fridays for this month.', {
          description:
            'If you need more blockouts, please contact the person-in-charge.',
        });

        return;
      }

      newSelectedDays.push(day);
    }
    setSelectedDays(newSelectedDays);
  };

  return (
    <>
      <Calendar
        disabled={disabledDays}
        mode='multiple'
        showOutsideDays={false}
        onDayClick={handleDayClick}
        selected={selectedDays}
        month={month}
        onMonthChange={setMonth}
        defaultMonth={DEFAULT_MONTH}
        fromMonth={MIN_MONTH}
        toMonth={MAX_MONTH}
        className='p-0'
        classNames={{
          caption_label: 'flex items-center gap-2 text-lg font-medium',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-14 w-14 bg-transparent p-0 opacity-50 hover:opacity-100 border-none'
          ),
          head_cell:
            'grow text-muted-foreground w-8 font-normal text-lg border border-solid',
          row: 'flex w-full',
          cell: ' w-full border border-solid grow relative p-0 text-center text-lg focus-within:relative focus-within:z-20 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md h-24',
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-full w-full p-0 font-normal aria-selected:opacity-90 text-lg rounded-none aria-selected:bg-[#fa5858]'
          ),
        }}
      />

      <div className='flex items-center justify-end mt-5'>
        <LoadingButton loading={loading} onClick={updateBlockoutDates}>
          Save
        </LoadingButton>
      </div>
    </>
  );
}
