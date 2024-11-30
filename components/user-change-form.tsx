'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { changePassword } from '@/app/(auth)/actions';
import { Icons } from '@/components/icons';
import { PasswordInput } from '@/components/password-input';
import { customNotifyEvent } from '@/components/session-provider';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { changeFormSchema, getStrength, requirements } from '@/lib/validation';

type UserChangeFormProps = React.HTMLAttributes<HTMLDivElement>;

export type ChangeFormData = z.infer<typeof changeFormSchema>;

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <div
      className='mt-2 flex items-center text-sm'
      style={{ color: meets ? 'teal' : 'red' }}
    >
      {meets ? <Icons.check /> : <Icons.close />}{' '}
      <p className='ml-3'>{label}</p>
    </div>
  );
}

export function UserChangeForm({ className, ...props }: UserChangeFormProps) {
  const form = useForm<ChangeFormData>({
    resolver: zodResolver(changeFormSchema),
    defaultValues: {
      password: '',
    },
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [popoverOpened, setPopoverOpened] = React.useState(false);
  const router = useRouter();

  const passwordValue = form.watch('password');

  const strength = getStrength(passwordValue);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={`requirement-${index}`}
      label={requirement.label}
      meets={requirement.re.test(passwordValue)}
    />
  ));

  async function handleChangeForm(data: ChangeFormData) {
    setIsLoading(true);
    const result = await changePassword(data);
    customNotifyEvent('USER_UPDATED', null);

    if (result?.serverError) {
      toast.error('Could not change password.', {
        description: result.serverError || 'Please try again.',
      });
      setIsLoading(false);
    } else {
      toast.success('Successfully changed password', {
        description: "You've successfully changed your password.",
      });
      // redirect to dashboard
      router.replace('/');
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleChangeForm)}>
          <div className='grid gap-2'>
            <div className='mb-2 grid gap-2'>
              <Popover open={popoverOpened}>
                <PopoverAnchor asChild>
                  <div
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                  >
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              title='Password must include a number, a lowercase letter, an uppercase letter, and a special character.'
                              id='password'
                              // type='password'
                              autoCapitalize='none'
                              autoComplete='password'
                              autoCorrect='off'
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </PopoverAnchor>

                <PopoverContent
                  className='w-full bg-background'
                  onOpenAutoFocus={(event) => event.preventDefault()}
                >
                  <Progress value={strength} className='w-80 text-zinc-300' />
                  <PasswordRequirement
                    label='Includes at least 6 characters'
                    meets={passwordValue?.length >= 6}
                  />
                  {checks}
                </PopoverContent>
              </Popover>
            </div>

            <Button type='submit' disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
