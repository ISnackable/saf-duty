'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ElementRef, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type Tables } from '@/types/supabase';

import { DatePicker } from './date-picker';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const profileFormSchema = z.object({
  avatar: z
    .custom<File>((v) => v instanceof File, {
      message: 'Image is required',
    })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`),
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  ord: z
    .date({
      required_error: 'A date of birth is required.',
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({
  profile,
}: {
  profile: Pick<Tables<'profiles'>, 'name' | 'avatar_url' | 'ord_date'>;
}) {
  const refImageInput = useRef<ElementRef<'input'> | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      avatar: undefined,
      name: profile.name,
      ord: profile.ord_date ? new Date(profile.ord_date) : undefined,
    },
    mode: 'onChange',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    profile.avatar_url
  );

  // revoke object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function onSubmit(data: ProfileFormValues) {
    toast('You submitted the following values:', {
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-3 gap-4'>
          <div className='col-span-3 md:col-span-1'>
            <Card>
              <CardContent>
                <div className='flex flex-col items-center space-y-6 pb-10 pt-20'>
                  <FormField
                    control={form.control}
                    name='avatar'
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem>
                        <div
                          className='m-auto mb-5 h-36 w-36 cursor-pointer rounded-full border border-dashed p-2'
                          onClick={() => {
                            refImageInput.current?.click();
                          }}
                        >
                          <FormControl>
                            <Input
                              type='file'
                              accept={ACCEPTED_IMAGE_TYPES.join(',')}
                              className='hidden'
                              onChange={(event) => {
                                const file =
                                  event.target.files && event.target.files[0];

                                if (!file) return;
                                onChange(file);

                                if (
                                  ACCEPTED_IMAGE_TYPES.includes(file.type) &&
                                  file.size <= MAX_FILE_SIZE
                                ) {
                                  setImagePreview(
                                    file ? URL.createObjectURL(file) : null
                                  );
                                }
                              }}
                              name={name}
                              ref={(e) => {
                                ref(e);
                                refImageInput.current = e;
                              }}
                              onBlur={onBlur}
                            />
                          </FormControl>

                          {imagePreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imagePreview}
                              alt='preview'
                              className='h-32 w-32 rounded-full object-cover'
                            />
                          ) : (
                            <div className='h-32 w-32 rounded-full bg-red-400'>
                              <div className='bg-[rgba(22, 28, 36, 0.64)] absolute flex h-32 w-32 flex-col items-center justify-center rounded-full text-white opacity-0 duration-300 hover:opacity-70'>
                                <Icons.camera size={30} />
                                <div className='text-sm'>Update photo</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className='text-center text-sm text-muted-foreground'>
                          Allowed *.jpeg, *.jpg, *.png max size of 5MB
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='col-span-3 space-y-8 md:col-span-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Your name' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ord'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>ORD</FormLabel>

                  <DatePicker
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />

                  <FormDescription>
                    Your date of ORD is used to calculate your progress till
                    ORD.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Update profile</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
