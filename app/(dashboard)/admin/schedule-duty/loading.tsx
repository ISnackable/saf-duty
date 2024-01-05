import { format } from 'date-fns';

import { DatePicker } from '@/components/date-picker';
import { Icons } from '@/components/icons';
import { LoadingButton } from '@/components/loading-button';
import { MultipleSelector } from '@/components/multi-select';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

const TODAY = new Date();

export default function Loading() {
  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex items-center space-y-2 w-full'>
        <Icons.edit className='inline-block w-8 h-8 mr-3 align-middle items-center' />
        <h1 className='scroll-m-20 border-b pb-2 text-2xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl grow'>
          Generate Duty
        </h1>
      </div>
      <p className='leading-7 [&:not(:first-child)]:mt-6'>
        Generate the duty roster for the selected month & year with the given
        personnels. The algorithm uses &quot;points&quot; to determine the
        number of duty days. Personnel with lower &quot;points&quot; will have
        more duty.
      </p>

      <form className='space-y-3'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='space-y-2'>Duty date</Label>
            <div className='flex h-full w-full flex-col rounded-md text-popover-foreground overflow-visible bg-transparent'>
              <Input
                value={format(TODAY, 'MMMM yyyy')}
                className='justify-start text-left font-normal text-sm py-2 px-4 items-center'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='space-y-2'>Extra date(s)</Label>
            <div className='flex h-full w-full flex-col rounded-md text-popover-foreground overflow-visible bg-transparent'>
              <DatePicker
                disableNavigation
                modifiers={{
                  disabled: [
                    {
                      dayOfWeek: [1, 2, 3, 4, 5],
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <Label className='space-y-2'>Choose personnel doing duties</Label>
          <MultipleSelector
            options={[]}
            placeholder='Pick all you like...'
            emptyIndicator={
              <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                no results found.
              </p>
            }
          />
        </div>

        <Calendar
          disableNavigation
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
            cell: 'w-full border border-solid grow relative p-0 text-center text-lg focus-within:relative focus-within:z-20 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md h-24',
            day: cn(
              'absolute top-1 md:top:3 right-2 md:right-4 block',
              // buttonVariants({ variant: 'ghost' }),
              'p-0 font-normal aria-selected:opacity-90 text-lg rounded-none aria-selected:bg-[#fa5858]'
            ),
            day_today: 'text-accent-foreground',
          }}
        />

        <div className='flex items-center justify-end mt-5 gap-4'>
          <LoadingButton variant='secondary'>Generate</LoadingButton>
          <LoadingButton type='submit'>Save</LoadingButton>
        </div>
      </form>
    </div>
  );
}
