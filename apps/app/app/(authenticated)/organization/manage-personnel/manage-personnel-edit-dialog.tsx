'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@repo/design-system/components/number-input';
import type { Row } from '@tanstack/react-table';
import { formatISO } from 'date-fns';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { fetcher } from '@/lib/fetcher';
import type { Profiles } from '@/lib/types';
import { DatePicker } from '@repo/design-system/components/date-picker';
import { LoadingButton } from '@repo/design-system/components/loading-button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters',
    })
    .regex(
      /^[a-zA-Z\s]*$/,
      'Name must not include numbers or special characters'
    )
    .trim(),
  image: z.string().url({ message: 'Please enter a valid URL' }).optional(),
  weekendPoints: z.coerce.number().int().min(-100).max(100),
  weekdayPoints: z.coerce.number().int().min(-100).max(100),
  noOfExtras: z.coerce.number().int().min(0).max(100),
  blockoutDates: z.array(z.date()),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProfileDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  profile: Row<Profiles>['original'] | null;
  showTrigger?: boolean;
}

export function EditProfileDialog({
  profile,
  showTrigger = true,
  ...props
}: EditProfileDialogProps) {
  const [isEditPending, starEditTransition] = React.useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: profile?.name || '',
      image: profile?.image ?? undefined,
      weekendPoints: profile?.weekendPoints ?? 0,
      weekdayPoints: profile?.weekdayPoints ?? 0,
      noOfExtras: profile?.noOfExtras ?? 0,
      blockoutDates: profile?.blockoutDates
        ? profile?.blockoutDates?.map((date) => new Date(date))
        : [],
    },
    mode: 'onSubmit',
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  const avatarWatch = useWatch({
    name: 'image',
    control: form.control,
  });

  function onSubmit(values: FormValues) {
    starEditTransition(() => {
      const resPromise = fetcher(`/api/profiles/${profile?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...values,
          blockoutDates: values.blockoutDates.map((date) =>
            formatISO(date, { representation: 'date' })
          ),
        }),
      });

      toast.promise(resPromise, {
        loading: 'Loading...',
        success: 'Profile updated.',
        error: 'An error occurred.',
        description(data) {
          if (data instanceof Error) {
            return data.message;
          }
          return 'You can now close this page.';
        },
      });
    });
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="flex items-center gap-4 align-middle">
                  <Avatar className="size-16">
                    <AvatarImage
                      crossOrigin="anonymous"
                      src={avatarWatch}
                      className="rounded-3xl object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <FormItem className="grow">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Anonymous" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 align-middle">
              <FormField
                control={form.control}
                name="weekendPoints"
                render={({ field }) => (
                  <FormItem className="basis-1/3">
                    <FormLabel>Weekend Points</FormLabel>
                    <FormControl>
                      <NumberInput
                        title="Weekend Points Input"
                        min={-100}
                        max={100}
                        {...field}
                      >
                        <NumberInputField className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                        <NumberInputStepper className="w-6 divide-y border-input border-l">
                          <NumberIncrementStepper className="rounded-tr-md border-input text-[0.75rem]" />
                          <NumberDecrementStepper className="rounded-br-md border-input text-[0.75rem]" />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weekdayPoints"
                render={({ field }) => (
                  <FormItem className="basis-1/3">
                    <FormLabel>Weekday Points</FormLabel>
                    <FormControl>
                      <NumberInput
                        title="Weekday Points Input"
                        min={-100}
                        max={100}
                        {...field}
                      >
                        <NumberInputField className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                        <NumberInputStepper className="w-6 divide-y border-input border-l">
                          <NumberIncrementStepper className="rounded-tr-md border-input text-[0.75rem]" />
                          <NumberDecrementStepper className="rounded-br-md border-input text-[0.75rem]" />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noOfExtras"
                render={({ field }) => (
                  <FormItem className="basis-1/3">
                    <FormLabel>No. of Extra</FormLabel>
                    <FormControl>
                      <NumberInput
                        title="No. of Extra Input"
                        min={0}
                        max={100}
                        {...field}
                      >
                        <NumberInputField className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                        <NumberInputStepper className="w-6 divide-y border-input border-l">
                          <NumberIncrementStepper className="rounded-tr-md border-input text-[0.75rem]" />
                          <NumberDecrementStepper className="rounded-br-md border-input text-[0.75rem]" />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="blockoutDates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockout Dates</FormLabel>

                  <DatePicker
                    className="max-w-[21.2rem] sm:max-w-[28.9rem]"
                    mode="multiple"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <LoadingButton type="submit" loading={isEditPending}>
                Save changes
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
