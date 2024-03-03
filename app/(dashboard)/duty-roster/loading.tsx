'use client';

import { format, parse, startOfMonth } from 'date-fns';
import { useSearchParams } from 'next/navigation';

import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/utils/cn';

const TODAY = new Date();

export default function Loading() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const month = params.get('month') ?? format(TODAY, 'MMMM');
  const year = params.get('year') ?? format(TODAY, 'yyyy');

  const monthDate = startOfMonth(
    parse(`${month} ${year}`, 'MMMM yyyy', new Date())
  );

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div data-tour='duty-roster-page'>
        <div className='flex w-full items-center space-y-2'>
          <Icons.edit className='mr-3 inline-block h-8 w-8 items-center align-middle' />
          <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
            Duty Roster
          </h1>
        </div>
        <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
          View the duty roster, below the date indicate the duty personnel while
          the circle bracket indicates the duty stand in personnel. Click on the
          date to request for swap duty.
        </p>
      </div>

      <Calendar
        disableNavigation
        showOutsideDays={false}
        mode='single'
        month={monthDate}
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
          cell: 'w-full border border-solid grow relative p-0 text-center text-lg focus-within:relative focus-within:z-20 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md h-24',
          day: cn(
            'sm:top:3 absolute right-2 top-1 text-sm sm:right-4 sm:text-lg',
            // buttonVariants({ variant: 'ghost' }),
            'rounded-none p-0 font-normal aria-selected:bg-[#fa5858] aria-selected:opacity-90'
          ),
          day_today: 'text-accent-foreground',
        }}
      />
    </div>
  );
}
