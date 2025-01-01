'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

import { useSession } from '@repo/auth/client';
import { DatePicker } from '@repo/design-system/components/date-picker';
import { Icons } from '@repo/design-system/components/icons';
import { LoadingButton } from '@repo/design-system/components/loading-button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const profileFormSchema = z.object({
  avatar: z
    .custom<File>((v) => v instanceof File || v instanceof Blob, {
      message: 'Image is required',
    })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max image size is 5MB.')
    .optional(),
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    })
    .regex(
      /^[a-zA-Z\s]*$/,
      'Name must not include numbers or special characters'
    )
    .trim(),
  ord_date: z
    .date({
      message: 'ORD date is required',
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { data: session } = useSession();

  const profile = session?.user;
  const [isLoading, setIsLoading] = React.useState(false);

  const refImageInput = React.useRef<React.ComponentRef<'input'> | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      avatar: undefined,
      name: profile?.name || '',
      ord_date: undefined,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: 'onChange',
  });

  const avatarWatch = useWatch({
    name: 'avatar',
    control: form.control,
  });
  const imagePreview = avatarWatch
    ? URL.createObjectURL(form.getValues('avatar') as File)
    : profile?.image;

  async function onSubmit(data: ProfileFormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 md:col-span-1">
            <Card>
              <CardContent>
                <div className="flex flex-col items-center space-y-6 pt-20 pb-10">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem>
                        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                        {/* biome-ignore lint/nursery/noStaticElementInteractions: <explanation> */}
                        <div
                          className="m-auto mb-5 h-36 w-36 cursor-pointer rounded-full border border-dashed p-2"
                          onClick={() => {
                            refImageInput.current?.click();
                          }}
                        >
                          <FormControl>
                            <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES.join(',')}
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (!file) {
                                  return;
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
                            <Avatar className="h-32 w-32">
                              <AvatarImage
                                src={imagePreview}
                                alt="preview"
                                className="object-cover"
                              />
                              <AvatarFallback>{profile?.name}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-32 w-32 rounded-full bg-red-400">
                              <div className="28, 36, 0.64)] absolute flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[rgba(22, text-white opacity-0 duration-300 hover:opacity-70">
                                <Icons.camera size={30} />
                                <div className="text-sm">Update photo</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-center text-muted-foreground text-sm">
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

          <div className="col-span-3 space-y-8 md:col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
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
              name="ord_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>ORD</FormLabel>

                  <DatePicker
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
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

            <LoadingButton type="submit" loading={isLoading}>
              Update profile
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
