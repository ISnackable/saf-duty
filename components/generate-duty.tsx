'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  format,
  formatISO,
  isWeekend,
  lastDayOfMonth,
  parse,
  startOfMonth,
  subDays,
} from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DayContent,
  DayContentProps,
  Button as DayPickerButton,
  DayProps,
  useDayRender,
} from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import * as z from 'zod';

import { DatePicker } from '@/components/date-picker';
import { LoadingButton } from '@/components/loading-button';
import { MonthPicker } from '@/components/month-picker';
import { MultipleSelector, Option } from '@/components/multi-select';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type DefaultPersonnel,
  type DutyDate,
  type Personnel,
  generateDutyRoster,
} from '@/lib/duty-roster';
import { fetcher } from '@/lib/fetcher';
import { Profiles } from '@/lib/supabase/queries';
import { cn } from '@/lib/utils';
import { indexOnceWithKey } from '@/utils/helper';

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  image: z.string().optional(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  personnels: z
    .array(optionSchema)
    .min(4, { message: 'At least 4 personnels are required' }),
  monthDate: z.date(),
  extraDates: z.array(z.date()),
  omitDates: z.array(z.date()),
});

const CredenzaFormSchema = z.object({
  date: z.date(),
  main: z.string(),
  reserve: z.string(),
  isExtra: z.boolean().default(false),
});

function DayDisableOutside(props: DayProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dayRender = useDayRender(props.date, props.displayMonth, buttonRef);

  if (dayRender.isHidden) {
    return <></>;
  }
  if (!dayRender.isButton || dayRender.activeModifiers.outside) {
    return <div {...dayRender.divProps} />;
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    dayRender.buttonProps?.onClick?.(e);
  };

  return (
    <DayPickerButton
      {...dayRender.buttonProps}
      ref={buttonRef}
      onClick={handleClick}
    />
  );
}

function createPersonnel(users: Profiles[], roster: Record<string, DutyDate>) {
  return users?.map((user) => {
    const blockouts = user.blockout_dates?.map(
      (blockout) => new Date(blockout)
    );
    const totalWeekdayAssigned = Object.values(roster).filter(
      (date) =>
        date.personnel?.id === user.id &&
        !date.isWeekend &&
        !date.isExtra &&
        !date.allocated
    ).length;
    const totalWeekendAssigned = Object.values(roster).filter(
      (date) =>
        date.personnel?.id === user.id &&
        date.isWeekend &&
        !date.isExtra &&
        !date.allocated
    ).length;

    return {
      id: user.id,
      name: user.name,
      weekdayPoints: user.weekday_points,
      weekendPoints: user.weekend_points,
      extra: user.no_of_extras ? user.no_of_extras : 0,
      blockouts: blockouts ? blockouts : [],
      weekdayRemaining: 0,
      reserveWeekdayRemaining: 0,
      totalWeekdayAssigned,
      weekendRemaining: 0,
      reserveWeekendRemaining: 0,
      totalWeekendAssigned,
      totalReversedAssigned: 0,
      totalExtraAssigned: 0,
    };
  });
}

function updateRoster(
  dutyRoster: Record<string, DutyDate>,
  personnel: Personnel[]
) {
  // TODO: Add validation to check if there are any empty dates
  // Maybe also only get the dates that are in the month
  const dutyDates = Object.values(dutyRoster);
  const resPromise = fetcher('/api/rosters', {
    method: 'POST',
    body: JSON.stringify({
      dutyDates,
      dutyPersonnels: personnel,
    }),
  });

  return toast.promise(resPromise, {
    loading: 'Loading...',
    success: 'Successfully updated duty roster.',
    error: 'Error updating duty roster.',
    description(data) {
      if (data instanceof Error) return data.message;
      return `You can now close this page.`;
    },
  });
}

function DayWithTime(props: DayContentProps, roster: Record<string, DutyDate>) {
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
        <div
          className={cn(
            'absolute bottom-1 mx-auto w-full whitespace-pre-wrap break-words text-xs md:bottom-3 md:text-base',
            roster[date]?.isExtra && 'text-red-600'
          )}
        >
          <span>
            {roster[date]?.personnel?.name} {roster[date]?.isExtra ? 'EX ' : ''}
          </span>
          <span>{`(${roster[date]?.reservePersonnel?.name})`}</span>
        </div>
      )}
    </div>
  );
}

export function GenerateDuty({
  roster,
  users,
  month,
  year,
}: {
  roster: Record<string, DutyDate>;
  users: Profiles[];
  month: string;
  year: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dutyRoster, setDutyRoster] =
    useState<Record<string, DutyDate>>(roster);
  const [dutyPersonnel, setDutyPersonnel] = useState<Personnel[]>(
    createPersonnel(users, roster)
  );

  // Only map users that are in the current roster
  const OPTIONS: Option[] = useMemo(
    () =>
      users.map((user) => ({
        label: user.name || '',
        value: user.id,
        image: user.avatar_url || '',
      })),
    [users]
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      monthDate: startOfMonth(
        parse(`${month} ${year}`, 'MMMM yyyy', new Date())
      ),
      personnels: OPTIONS,
      extraDates: [],
      omitDates: [],
    },
  });
  const credenzaForm = useForm<z.infer<typeof CredenzaFormSchema>>({
    resolver: zodResolver(CredenzaFormSchema),
  });

  const monthDate = form.watch('monthDate');

  useEffect(() => {
    // Check whether the roster contains the same dates as the duty roster
    // If not, reset the duty roster

    if (
      formatISO(monthDate, { representation: 'date' }) in roster ||
      formatISO(subDays(monthDate, 1), { representation: 'date' }) in roster
    ) {
      setDutyRoster(roster);

      // const uniquePersonnels = Array.from(
      //   new Set(
      //     Object.values(roster)
      //       .map((date) => date.personnel?.id)
      //       .filter(Boolean)
      //   )
      // );
      // const personnels = OPTIONS.filter((option) =>
      //   uniquePersonnels.includes(option.value)
      // );

      // form.setValue('personnels', personnels);
    } else {
      setDutyRoster({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster, monthDate]);

  const createMonthURL = useDebouncedCallback((month: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('month', format(month, 'LLLL'));
    params.set('year', month.getFullYear().toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  const handleRosterSave = async () => {
    if (Object.keys(dutyRoster).length === 0) {
      return toast.warning('You need to generate a duty roster first.');
    }
    setLoading(true);

    if (formatISO(monthDate, { representation: 'date' }) in roster) {
      toast.warning('A duty roster already exists.', {
        duration: Infinity,
        important: true,
        onDismiss: () => {
          toast.dismiss();
          setLoading(false);
        },
        action: {
          label: 'Override',
          onClick: () => {
            updateRoster(dutyRoster, dutyPersonnel);
            setLoading(false);
          },
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {
            toast.dismiss();
            setLoading(false);
          },
        },
        description: 'Do you want to override it?',
      });
    } else {
      updateRoster(dutyRoster, dutyPersonnel);
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    const validated = await form.trigger();
    if (!validated) {
      return toast.warning('You need to select at least 4 personnels');
    }

    const personnelsId = form.getValues('personnels').map((personnel) => {
      return personnel.value;
    });
    const personnels: DefaultPersonnel[] = users
      .filter((user) => personnelsId.includes(user.id))
      .map((user) => ({
        id: user.id,
        name: user.name,
        weekdayPoints: user.weekday_points,
        weekendPoints: user.weekend_points,
        extra: user.no_of_extras ? user.no_of_extras : 0,
        blockouts: user.blockout_dates?.map((blockout) => new Date(blockout)),
      }));

    // Loop until no error is thrown, but max iteration is 100
    for (let i = 0; i < 100; i++) {
      try {
        const { dutyDates, dutyPersonnel } = generateDutyRoster({
          users: personnels,
          month: form.getValues('monthDate'),
          extraDates: form.getValues('extraDates'),
          omitDates: form.getValues('omitDates'),
        });

        // If no error is thrown, set the duty roster and duty personnel
        const indexedRoster = indexOnceWithKey(dutyDates, 'date');
        setDutyRoster(indexedRoster);
        setDutyPersonnel(dutyPersonnel);

        break;
      } catch (error) {
        if (error instanceof Error) {
          // Last iteration, show error
          if (i === 99) {
            toast.error('Error', {
              description: `${error.message}, you can try again or contact the developer`,
            });
            console.error(error);
          }
        }
      }
    }
  };

  const handleCredenzaSave = async (
    values: z.infer<typeof CredenzaFormSchema>
  ) => {
    const validated = await credenzaForm.trigger();
    if (!validated) {
      return toast.error('Something went wrong');
    }

    const date = formatISO(values.date, { representation: 'date' });
    const mainPersonnel = values.main;
    const reservePersonnel = values.reserve;
    const prevDutyRoster = { ...dutyRoster };

    const prevPersonnel = dutyPersonnel.find(
      (personnel) => personnel.id === prevDutyRoster[date]?.personnel?.id
    );
    const newPersonnel = dutyPersonnel.find(
      (personnel) => personnel.id === mainPersonnel
    );
    const newReservePersonnel = dutyPersonnel.find(
      (personnel) => personnel.id === reservePersonnel
    );

    // Update the roster with the new personnel/stand in
    const updatedRoster = {
      ...prevDutyRoster,
      [date]: {
        ...prevDutyRoster[date],
        isExtra: values.isExtra,
        personnel: {
          id: mainPersonnel,
          name: newPersonnel?.name || '',
        },
        reservePersonnel: {
          id: reservePersonnel,
          name: newReservePersonnel?.name || '',
        },
      },
    };

    // Update the personnel with the new points
    if (newPersonnel && prevPersonnel) {
      if (isWeekend(new Date(date))) {
        newPersonnel.totalWeekendAssigned += 1;
        prevPersonnel.totalWeekendAssigned -= 1;

        newPersonnel.weekendPoints += 1;
        prevPersonnel.weekendPoints -= 1;
      } else {
        newPersonnel.totalWeekdayAssigned += 1;
        prevPersonnel.totalWeekdayAssigned -= 1;

        newPersonnel.weekdayPoints += 1;
        prevPersonnel.weekdayPoints -= 1;
      }

      if (values.isExtra && newPersonnel.extra > 0) {
        newPersonnel.extra -= 1;
        newPersonnel.totalExtraAssigned += 1;
        // Extra does not count as a normal weekend duty
        newPersonnel.totalWeekendAssigned -= 1;
        newPersonnel.weekendPoints -= 1;
      }
    }

    const updatedPersonnel = dutyPersonnel.map((personnel) => {
      if (personnel.id === newPersonnel?.id) {
        return newPersonnel;
      }
      if (personnel.id === prevPersonnel?.id) {
        return prevPersonnel;
      }
      return personnel;
    });

    setDutyRoster(updatedRoster);
    setDutyPersonnel(updatedPersonnel);

    toast.success('Successfully updated duty roster', {
      description: 'You can now close this popup.',
      action: {
        label: 'Undo',
        onClick: () => {
          setDutyRoster(prevDutyRoster);
        },
      },
    });
    setOpen(false);
  };

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRosterSave)}
          className='space-y-3'
        >
          <div className='grid grid-cols-3 gap-4'>
            <FormField
              control={form.control}
              name='monthDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duty date</FormLabel>
                  <FormControl>
                    <div className='flex h-full w-full flex-col overflow-visible rounded-md bg-transparent text-popover-foreground'>
                      <MonthPicker
                        defaultMonth={field.value}
                        month={field.value}
                        onMonthChange={(e) => {
                          form.resetField('extraDates');
                          form.resetField('omitDates');
                          field.onChange(e);
                          createMonthURL(e);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='omitDates'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Omit date(s)</FormLabel>
                  <FormControl>
                    <div className='flex h-full w-full flex-col overflow-visible rounded-md bg-transparent text-popover-foreground'>
                      <DatePicker
                        disableNavigation
                        modifiers={{
                          disabled: [
                            {
                              after: lastDayOfMonth(monthDate),
                              before: monthDate,
                            },
                          ],
                        }}
                        mode='multiple'
                        defaultMonth={monthDate}
                        month={monthDate}
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='extraDates'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra date(s)</FormLabel>
                  <FormControl>
                    <div className='flex h-full w-full flex-col overflow-visible rounded-md bg-transparent text-popover-foreground'>
                      <DatePicker
                        disableNavigation
                        modifiers={{
                          disabled: [
                            {
                              after: lastDayOfMonth(monthDate),
                              before: monthDate,
                            },
                            {
                              dayOfWeek: [1, 2, 3, 4, 5],
                            },
                          ],
                        }}
                        mode='multiple'
                        defaultMonth={monthDate}
                        month={monthDate}
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='personnels'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose personnel doing duties</FormLabel>
                <FormControl>
                  <MultipleSelector
                    hidePlaceholderWhenSelected
                    value={field.value}
                    onChange={field.onChange}
                    options={OPTIONS}
                    placeholder='Pick all you like...'
                    emptyIndicator={
                      <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                        no results found.
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Calendar
            key={`${month}-${year}`}
            disableNavigation
            components={{
              Day: DayDisableOutside,
              DayContent: (props) => DayWithTime(props, dutyRoster),
            }}
            onDayClick={(day) => {
              if (day) {
                const date = formatISO(day, { representation: 'date' });

                credenzaForm.setValue('date', day);
                credenzaForm.setValue(
                  'main',
                  dutyRoster[date]?.personnel?.id || ''
                );
                credenzaForm.setValue(
                  'reserve',
                  dutyRoster[date]?.reservePersonnel?.id || ''
                );
                credenzaForm.setValue('isExtra', dutyRoster[date]?.isExtra);
                setOpen(true);
              }
            }}
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
                buttonVariants({ variant: 'ghost' }),
                'h-full w-full rounded-none p-0 text-lg font-normal aria-selected:bg-[#fa5858] aria-selected:opacity-90'
              ),
              day_today:
                'text-accent-foreground text-sky-600 dark:text-sky-300',
            }}
          />

          <div className='mt-5 flex items-center justify-end gap-4'>
            <LoadingButton
              type='button'
              disabled={loading}
              variant='secondary'
              onClick={handleGenerate}
            >
              Generate
            </LoadingButton>
            <LoadingButton loading={loading} type='submit'>
              Save
            </LoadingButton>
          </div>
        </form>
      </Form>

      {form.watch('personnels').length > 0 &&
        Object.keys(dutyRoster).length !== 0 &&
        formatISO(monthDate, { representation: 'date' }) in dutyRoster && (
          <ScrollArea>
            <Table className='min-w-[700px] border'>
              <TableHeader className='bg-secondary'>
                <TableRow>
                  <TableHead>Personnel</TableHead>
                  <TableHead>Weekday Points</TableHead>
                  <TableHead>Weekend Points</TableHead>
                  <TableHead>Extras</TableHead>
                  <TableHead>No. of duties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form
                  .watch('personnels')
                  .toSorted((a, b) =>
                    a.value < b.value ? -1 : a.value > b.value ? 1 : 0
                  )
                  .map((option) => {
                    const personnel = dutyPersonnel?.find(
                      (personnel) => personnel.id === option.value
                    );
                    const user = users?.find(
                      (user) => user?.id === personnel?.id
                    );
                    if (!personnel || !user) return null;

                    return (
                      <TableRow key={personnel.id}>
                        <TableCell>{personnel.name}</TableCell>
                        <TableCell>{`${user.weekday_points} ${
                          personnel ? ' ⟶ ' + personnel.weekdayPoints : ''
                        }`}</TableCell>
                        <TableCell>{`${user.weekend_points} ${
                          personnel ? ' ⟶ ' + personnel.weekendPoints : ''
                        }`}</TableCell>
                        <TableCell>
                          {`${user?.no_of_extras} ${
                            personnel ? ' ⟶ ' + personnel.extra : ''
                          }`}
                        </TableCell>
                        <TableCell>
                          {`${
                            personnel ? personnel.totalWeekdayAssigned : 0
                          } weekday, ${
                            personnel
                              ? personnel.totalWeekendAssigned +
                                personnel.totalExtraAssigned
                              : 0
                          } weekend --- Total: (${
                            personnel
                              ? personnel.totalWeekdayAssigned +
                                personnel.totalWeekendAssigned +
                                personnel.totalExtraAssigned
                              : 0
                          })`}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        )}

      <CredenzaContent className='min-w-[300px] md:min-w-[750px]'>
        <Form {...credenzaForm}>
          <form
            onSubmit={credenzaForm.handleSubmit(handleCredenzaSave)}
            className='space-y-6'
          >
            <CredenzaHeader>
              <CredenzaTitle>Manaully Choose Personnels</CredenzaTitle>
              <CredenzaDescription>
                You should make sure that the stand in is not the same person as
                the duty personnel. It is also recommended that the duty
                personnel/stand in is not the same person as the next/previous
                person.
              </CredenzaDescription>
            </CredenzaHeader>

            <CredenzaBody>
              <div className='flex flex-row items-center justify-start gap-4'>
                <div className='grid w-full items-center gap-1.5'>
                  <FormField
                    control={credenzaForm.control}
                    name='main'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duty Personnel</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a value...' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid w-full items-center gap-1.5'>
                  <FormField
                    control={credenzaForm.control}
                    name='reserve'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reserve Duty Personnel</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a value...' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {isWeekend(new Date(credenzaForm.getValues('date'))) && (
                <FormField
                  control={credenzaForm.control}
                  name='isExtra'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 pt-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Is Extra?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </CredenzaBody>

            <CredenzaFooter>
              <CredenzaClose asChild>
                <Button variant='outline'>Close</Button>
              </CredenzaClose>
              <Button type='submit'>Save</Button>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}
