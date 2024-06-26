'use client';

import {
  type Interval,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  formatISO,
  isFriday,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfMonth,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DayClickEventHandler } from 'react-day-picker';
import { toast } from 'sonner';

import { LoadingButton } from '@/components/loading-button';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useProfiles } from '@/hooks/use-profiles';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

export const MAXIMUM_BLOCKOUTS = 8;
const TODAY = new Date();
const DEFAULT_MONTH = addMonths(TODAY, 1);
const MIN_MONTH = startOfMonth(TODAY);
const MAX_MONTH = endOfMonth(addMonths(MIN_MONTH, 2));

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

export function ManageBlockout() {
  const { data: profile, isLoading, mutate } = useProfiles();

  const [month, setMonth] = useState<Date>(DEFAULT_MONTH);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  const maximumBlockouts = profile?.max_blockouts || MAXIMUM_BLOCKOUTS;
  const currentMonthSelected = useMemo(
    () => selectedDays.filter((d: Date) => isSameMonth(d, month)),
    [selectedDays, month]
  );

  const disableDateExceedMatcher = useCallback(
    (day: Date) => {
      if (currentMonthSelected.length >= maximumBlockouts) {
        // If the day is not selected, disable it.
        return !selectedDays.find(
          (date) =>
            date.getDate() === day.getDate() &&
            date.getMonth() === day.getMonth()
        );
      }

      return false;
    },
    [currentMonthSelected, maximumBlockouts, selectedDays]
  );

  const updateBlockoutDates = async () => {
    setLoading(true);

    const resPromise = fetcher(`/api/profiles/${profile?.id}/blockout-dates`, {
      method: 'POST',
      body: JSON.stringify({
        blockout_dates: selectedDays.map((date) =>
          formatISO(date, { representation: 'date' })
        ),
      }),
    }).then(() => {
      if (profile) {
        mutate({
          ...profile,
          blockout_dates: selectedDays.map((date) =>
            formatISO(date, { representation: 'date' })
          ),
        });
      }
    });

    toast.promise(resPromise, {
      loading: 'Loading...',
      success: 'Blockout dates updated.',
      error: 'An error occurred.',
      description(data) {
        if (data instanceof Error) return data.message;
        return `You can now close this page.`;
      },
    });

    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      setSelectedDays(
        profile?.blockout_dates
          ? profile.blockout_dates
              .filter(
                (date) =>
                  new Date(date).getTime() >= MIN_MONTH.getTime() &&
                  new Date(date).getTime() <= MAX_MONTH.getTime()
              )
              .map((date) => new Date(date))
          : []
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (currentMonthSelected.length >= maximumBlockouts) {
      toast.warning('You have reached the maximum blockouts for this month.', {
        duration: 5000,
        description:
          'If you need more blockouts, please contact the person-in-charge.',
      });
    }
  }, [maximumBlockouts, currentMonthSelected.length]);

  const handleDayClick: DayClickEventHandler = useCallback(
    (day, modifiers) => {
      const newSelectedDays = [...selectedDays];

      if (modifiers.selected) {
        const index = selectedDays.findIndex((selectedDay) =>
          isSameDay(day, selectedDay)
        );
        newSelectedDays.splice(index, 1);
      } else {
        const start = startOfMonth(day);
        const end = endOfMonth(day);
        const { weekends, fridays } = eachWeekendAndFridayOfMonth({
          start,
          end,
        });

        const numSelectedWeekends = countSelectedDates(
          weekends,
          newSelectedDays
        );
        const numSelectedFridays = countSelectedDates(fridays, newSelectedDays);

        const canSelectWeekend = numSelectedWeekends < weekends.length - 2;
        const canSelectFriday = numSelectedFridays < fridays.length - 1;

        if (isWeekend(day) && !canSelectWeekend) {
          toast.warning(
            'You have reached the maximum weekends for this month.',
            {
              description:
                'If you need more blockouts, please contact the person-in-charge.',
            }
          );

          return;
        } else if (isFriday(day) && !canSelectFriday) {
          toast.warning(
            'You have reached the maximum Fridays for this month.',
            {
              description:
                'If you need more blockouts, please contact the person-in-charge.',
            }
          );

          return;
        }

        newSelectedDays.push(day);
      }
      setSelectedDays(newSelectedDays);
    },
    [selectedDays]
  );

  return (
    <>
      <Calendar
        modifiers={{
          disabled: disableDateExceedMatcher,
        }}
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
            'h-14 w-14 border-none bg-transparent p-0 opacity-50 hover:opacity-100'
          ),
          head_cell:
            'grow text-muted-foreground w-8 font-normal text-lg border border-solid',
          row: 'flex w-full',
          cell: ' w-full border border-solid grow relative p-0 text-center text-lg focus-within:relative focus-within:z-20 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md h-24',
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-full w-full rounded-none p-0 text-lg font-normal aria-selected:bg-[#fa5858] aria-selected:opacity-90'
          ),
        }}
      />

      <div className='mt-5 flex items-center justify-end'>
        <LoadingButton
          loading={loading}
          onClick={updateBlockoutDates}
          data-tour='manage-blockouts-save-btn-page'
        >
          Save
        </LoadingButton>
      </div>
    </>
  );
}
