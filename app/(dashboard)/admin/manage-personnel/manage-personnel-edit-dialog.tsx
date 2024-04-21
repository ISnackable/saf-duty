'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type Row } from '@tanstack/react-table';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DatePicker } from '@/components/date-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Profiles } from '@/lib/supabase/queries';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be between 2 and 50 characters' })
    .max(50, { message: 'Name must be between 2 and 50 characters' }),
  avatar_url: z.string().url({ message: 'Please enter a valid URL' }),
  weekend_points: z.number().int().min(-100).max(100),
  weekday_points: z.number().int().min(-100).max(100),
  no_of_extras: z.number().int().min(0).max(100),
  blockout_dates: z.array(z.date()),
});
// import { deleteTasks } from "../_lib/mutations"

interface EditProfileDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  profile: Row<Profiles>;
  showTrigger?: boolean;
}

export function EditProfileDialog({
  profile,
  showTrigger = true,
  ...props
}: EditProfileDialogProps) {
  const [isEditPending, starEditTransition] = React.useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.original.name,
      avatar_url: profile.original.avatar_url ?? '',
      weekend_points: profile.original.weekend_points,
      weekday_points: profile.original.weekday_points,
      no_of_extras: profile.original.no_of_extras ?? 0,
      blockout_dates:
        profile.original.blockout_dates?.map((d) => new Date(d)) ?? [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant='outline'>Edit Profile</Button>
        </DialogTrigger>
      ) : null}
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <div className='flex items-center gap-4 align-middle'>
                  <Avatar className='size-16'>
                    <AvatarImage
                      src={form.watch('avatar_url') ?? ''}
                      className='rounded-3xl'
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <FormItem className='grow'>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Anonymous' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name='avatar_url'
              render={({ field }) => (
                <FormItem className='grow'>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center gap-2 align-middle'>
              <FormField
                control={form.control}
                name='weekend_points'
                render={({ field }) => (
                  <FormItem className='grow'>
                    <FormLabel>Weekend Points</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        pattern='[0-9]*'
                        min={-100}
                        max={100}
                        {...field}
                        onChange={(value) =>
                          field.onChange(value.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='weekday_points'
                render={({ field }) => (
                  <FormItem className='grow'>
                    <FormLabel>Weekday Points</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        pattern='[0-9]*'
                        min={-100}
                        max={100}
                        {...field}
                        onChange={(value) =>
                          field.onChange(value.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='no_of_extras'
                render={({ field }) => (
                  <FormItem className='grow'>
                    <FormLabel>No. of Extra</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        pattern='[0-9]*'
                        min={0}
                        max={100}
                        {...field}
                        onChange={(value) =>
                          field.onChange(value.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='blockout_dates'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Blockout Dates</FormLabel>

                  <DatePicker
                    className='max-w-[340px] sm:max-w-[460px]'
                    mode='multiple'
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </FormItem>
              )}
            />

            <DialogFooter className='mt-4'>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
