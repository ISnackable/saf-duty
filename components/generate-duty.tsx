'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, isSameMonth, lastDayOfMonth, startOfMonth } from 'date-fns';
import { useRef, useState } from 'react';
import {
  DayContent,
  DayContentProps,
  Button as DayPickerButton,
  DayProps,
  useDayRender,
} from 'react-day-picker';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { DatePicker } from '@/components/date-picker';
import { LoadingButton } from '@/components/loading-button';
import { MonthPicker } from '@/components/month-picker';
import { MultipleSelector, Option } from '@/components/multi-select';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dutyRoster } from '@/lib/demo-data';
import { cn } from '@/utils/cn';

const TODAY = new Date();
const FIRST_DAY = startOfMonth(TODAY);

const OPTIONS: Option[] = [
  {
    label: 'nextjs',
    value: 'nextjs',
    image:
      'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png',
  },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember', disable: true },
  { label: 'Gatsby', value: 'gatsby', disable: true },
  { label: 'Astro', value: 'astro' },
];

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
  extraDates: z.array(z.date()).optional(),
});

const CredenzaFormSchema = z.object({
  main: z.string(),
  reserve: z.string(),
});

function DayWithTime(props: DayContentProps) {
  const dateTime = format(props.date, 'yyyy-MM-dd');
  return (
    <div className='relative h-full w-full'>
      <time
        dateTime={dateTime}
        className='absolute top-1 md:top:3 right-2 md:right-4'
      >
        <DayContent {...props} />
      </time>

      {/* <p className='absolute bottom-1 mx-auto w-full md:bottom-3 text-xs md:text-base break-word whitespace-pre-wrap'>
        Srinath EX (Joon Kang)
      </p> */}
    </div>
  );
}

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

export function GenerateDuty() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      monthDate: FIRST_DAY,
      personnels: [],
    },
  });
  const credenzaForm = useForm<z.infer<typeof CredenzaFormSchema>>({
    resolver: zodResolver(CredenzaFormSchema),
  });

  const monthDate = form.watch('monthDate');
  const dutyDates = dutyRoster.find((cal) =>
    isSameMonth(new Date(cal.date), monthDate)
  );

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => console.log(data))}
          className='space-y-3'
        >
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='monthDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duty date</FormLabel>
                  <FormControl>
                    <div className='flex h-full w-full flex-col rounded-md text-popover-foreground overflow-visible bg-transparent'>
                      <MonthPicker
                        month={field.value}
                        onMonthChange={(e) => {
                          form.resetField('extraDates');
                          field.onChange(e);
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
              name='extraDates'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra date(s)</FormLabel>
                  <FormControl>
                    <div className='flex h-full w-full flex-col rounded-md text-popover-foreground overflow-visible bg-transparent'>
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
            disableNavigation
            components={{
              Day: DayDisableOutside,
              DayContent: DayWithTime,
            }}
            onDayClick={(day) => {
              console.log(day);

              if (dutyDates) setOpen(true);
            }}
            mode='single'
            month={monthDate}
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
                buttonVariants({ variant: 'ghost' }),
                'h-full w-full p-0 font-normal aria-selected:opacity-90 text-lg rounded-none aria-selected:bg-[#fa5858]'
              ),
              day_today: 'text-accent-foreground',
            }}
          />

          <div className='flex items-center justify-end mt-5 gap-4'>
            <LoadingButton loading={loading} variant='secondary'>
              Generate
            </LoadingButton>
            <LoadingButton loading={loading} type='submit'>
              Save
            </LoadingButton>
          </div>
        </form>
      </Form>

      <CredenzaContent className='min-w-[300px] md:min-w-[750px]'>
        <Form {...credenzaForm}>
          <form
            onSubmit={credenzaForm.handleSubmit((data) => console.log(data))}
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
              <div className='flex flex-row justify-start items-center gap-4'>
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
