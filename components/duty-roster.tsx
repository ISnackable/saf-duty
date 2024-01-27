'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type Session } from '@supabase/supabase-js';
import {
  addDays,
  format,
  formatISO,
  parse,
  startOfMonth,
  subDays,
} from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DayContent, DayContentProps } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import * as z from 'zod';

import { BentoGrid, BentoGridItem } from '@/components/bento-grid';
import { Icons } from '@/components/icons';
import { LoadingButton } from '@/components/loading-button';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type DutyDate } from '@/lib/duty-roster';
import { cn } from '@/utils/cn';

import { Indicator } from './indicator';

const PersonnelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const DutyDateSchema = z.object({
  id: z.number().optional(),
  date: z.string(),
  isExtra: z.boolean(),
  isWeekend: z.boolean(),
  blockout: z.array(z.string()),
  personnel: PersonnelSchema.nullable(),
  reservePersonnel: PersonnelSchema.nullable(),
  allocated: z.boolean(),
});

const CredenzaFormSchema = z.object({
  receiverRoster: DutyDateSchema,
  receiver: PersonnelSchema,
  requesterRoster: DutyDateSchema,
  requester: PersonnelSchema,
  reason: z
    .string()
    .max(100, { message: 'Reason must be less than 100 characters' })
    .optional(),
});

function DayWithTime(
  props: DayContentProps,
  roster: Record<string, DutyDate>,
  session: Session
) {
  const date = formatISO(props.date, { representation: 'date' });

  return (
    <div className='relative h-full w-full'>
      <time
        dateTime={date}
        className='sm:top:3 absolute right-2 top-1 text-sm sm:right-4 sm:text-lg'
      >
        <DayContent {...props} />
      </time>

      {roster && roster.hasOwnProperty(date) && (
        <Indicator
          disabled={roster[date]?.personnel?.id !== session?.user?.id}
          placement='top-right'
          className='h-2.5 w-2.5'
        >
          <div
            className={cn(
              'absolute bottom-1 mx-auto w-full whitespace-pre-wrap break-words text-xs text-foreground/90 md:bottom-3 md:text-base',
              roster[date]?.isExtra && 'text-red-600'
            )}
          >
            <span>
              {roster[date]?.personnel?.name}{' '}
              {roster[date]?.isExtra ? 'EX ' : ''}
            </span>
            <span>{`(${roster[date]?.reservePersonnel?.name})`}</span>
          </div>
        </Indicator>
      )}
    </div>
  );
}

export function DutyRoster({
  session,
  roster,
  month,
  year,
}: {
  session: Session;
  roster: Record<string, DutyDate>;
  month: string;
  year: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(
    startOfMonth(parse(`${month} ${year}`, 'MMMM yyyy', new Date()))
  );

  const [dutyRoster, setDutyRoster] =
    useState<Record<string, DutyDate>>(roster);

  const credenzaForm = useForm<z.infer<typeof CredenzaFormSchema>>({
    resolver: zodResolver(CredenzaFormSchema),
  });

  useEffect(() => {
    // Check whether the roster contains the same dates as the duty roster
    // If not, reset the duty roster

    if (
      formatISO(monthDate, { representation: 'date' }) in roster ||
      formatISO(subDays(monthDate, 1), { representation: 'date' }) in roster
    ) {
      setDutyRoster(roster);
    } else {
      setDutyRoster({});
    }
  }, [roster, monthDate]);

  useEffect(() => {
    if (!searchParams.has('month') || !searchParams.has('year')) {
      setMonthDate(
        startOfMonth(parse(`${month} ${year}`, 'MMMM yyyy', new Date()))
      );
    }
  }, [month, year, searchParams]);

  const createMonthURL = useDebouncedCallback((month: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('month', format(month, 'LLLL'));
    params.set('year', month.getFullYear().toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  async function handleSwapDuty(values: z.infer<typeof CredenzaFormSchema>) {
    setLoading(true);

    toast('info', {
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });

    setLoading(false);
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <Calendar
        showOutsideDays={false}
        key={`${month}-${year}`}
        components={{
          DayContent: (props) => DayWithTime(props, dutyRoster, session),
        }}
        onDayClick={(day) => {
          if (day) {
            const date = formatISO(day, { representation: 'date' });
            const roster = dutyRoster[date];
            const prevDate = formatISO(subDays(day, 1), {
              representation: 'date',
            });
            const nextDate = formatISO(addDays(day, 1), {
              representation: 'date',
            });

            if (!roster || !roster?.personnel) return;

            // Check if date is in the past, or if the personnel is the current user
            if (day.getTime() < new Date().getTime()) {
              toast.warning("You can't swap duty in the past!");
              return;
            } else if (roster?.personnel?.id === session.user.id) {
              toast.warning("You can't swap duty with yourself!");
              return;
            } else if (
              dutyRoster[prevDate]?.personnel?.id === session.user.id ||
              dutyRoster[nextDate]?.personnel?.id === session.user.id
            ) {
              toast.warning(
                'You are the personnel on duty for the day before or after'
              );
            }

            // Reset the form
            credenzaForm.reset();

            credenzaForm.setValue('receiverRoster', roster);
            credenzaForm.setValue('receiver', roster.personnel);
            credenzaForm.setValue('requester', {
              id: session.user.id,
              name: session.user.user_metadata.name,
            });
            setOpen(true);
          }
        }}
        mode='single'
        month={monthDate}
        onMonthChange={(month) => {
          setMonthDate(month);
          createMonthURL(month);
        }}
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
            buttonVariants({ variant: 'ghost' }),
            'h-full w-full rounded-none p-0 text-lg font-normal aria-selected:bg-[#fa5858] aria-selected:opacity-90'
          ),
          day_today: 'text-accent-foreground text-sky-300',
        }}
      />

      <CredenzaContent className='min-w-[300px] md:min-w-[750px]'>
        <Form {...credenzaForm}>
          <form
            onSubmit={credenzaForm.handleSubmit(handleSwapDuty)}
            className='space-y-4'
          >
            <CredenzaHeader>
              <CredenzaTitle>Request Swap Duty</CredenzaTitle>
              <CredenzaDescription>
                Request to swap duty with another personnel.
              </CredenzaDescription>
            </CredenzaHeader>

            <CredenzaBody>
              {credenzaForm.getValues('receiverRoster') && (
                <div className='space-y-2'>
                  <BentoGrid className='md:auto-rows mx-auto max-w-4xl grid-cols-2 md:grid-cols-2'>
                    <BentoGridItem
                      title='Date'
                      description={format(
                        credenzaForm.getValues('receiverRoster').date,
                        'PPPP'
                      )}
                      header={<Icons.calendar className='h-12 w-12' />}
                    />
                    <BentoGridItem
                      title='Duty Personnel'
                      description={credenzaForm.getValues('receiver').name}
                      header={<Icons.user className='h-12 w-12 ' />}
                    />
                  </BentoGrid>

                  <FormField
                    control={credenzaForm.control}
                    name='requesterRoster'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="after:text-red-500 after:content-['_*']"
                          aria-required
                        >
                          Pick a date to swap
                        </FormLabel>
                        <Select
                          onValueChange={(date) =>
                            field.onChange(dutyRoster[date])
                          }
                          defaultValue={undefined}
                        >
                          <FormControl aria-required>
                            <SelectTrigger>
                              <SelectValue placeholder='Pick one...' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(dutyRoster)
                              .filter(
                                (roster) =>
                                  roster?.personnel?.id === session?.user?.id &&
                                  new Date(roster?.date).getTime() >
                                    new Date().getTime()
                              )
                              .map((roster) => (
                                <SelectItem key={roster.id} value={roster.date}>
                                  {format(roster.date, 'ccc, PP')}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={credenzaForm.control}
                    name='reason'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for swap (optional)</FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder="I need to attend my friend's birthday on the 21st."
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CredenzaBody>

            <CredenzaFooter>
              <LoadingButton type='submit' loading={loading}>
                Request Swap
              </LoadingButton>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}