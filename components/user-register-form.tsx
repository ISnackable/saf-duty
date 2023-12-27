'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { Check, X } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { signUp } from '@/app/(auth)/actions';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PinInput } from '@/components/ui/pin-input';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RegisterFormSchema, requirements } from '@/utils/auth-validation';
import { cn } from '@/utils/cn';

type UserRegisterFormProps = React.HTMLAttributes<HTMLDivElement>;

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;

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
      {meets ? <Check /> : <X />} <p className='ml-3'>{label}</p>
    </div>
  );
}

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  // for of loop
  for (const requirement of requirements) {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  }

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export function UserRegisterForm({
  className,
  ...props
}: UserRegisterFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [popoverOpened, setPopoverOpened] = React.useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      unit: '',
    },
  });

  const passwordValue = form.watch('password');

  const strength = getStrength(passwordValue);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={`requirement-${index}`}
      label={requirement.label}
      meets={requirement.re.test(passwordValue)}
    />
  ));

  async function handleRegisterForm(data: RegisterFormData) {
    setIsLoading(true);
    const { status, message } = await signUp(data);

    if (status === 'error') {
      toast(message || 'Something went wrong.', {
        description: 'Your sign up request failed. Please try again.',
      });
    } else {
      toast(message || 'Check your email.', {
        description:
          'We sent you a login link. Be sure to check your spam too.',
      });
    }

    setIsLoading(false);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegisterForm)}>
          <div className='grid gap-2'>
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='your name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id='email'
                        placeholder='name@example.com'
                        type='email'
                        autoCapitalize='none'
                        autoComplete='email'
                        autoCorrect='off'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid gap-2'>
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
                            <Input
                              title='Password must include a number, a lowercase letter, an uppercase letter, and a special character.'
                              id='password'
                              type='password'
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
                    meets={passwordValue?.length > 5}
                  />
                  {checks}
                </PopoverContent>
              </Popover>
            </div>
            <div className='mb-2 grid gap-2'>
              <FormField
                control={form.control}
                name='unit'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit code</FormLabel>
                    <FormControl>
                      <PinInput
                        id='unit'
                        type='text'
                        inputMode='numeric'
                        disabled={isLoading}
                        placeholder='0'
                        {...field}
                        value={form.watch('unit')}
                        onChange={(val: string) => form.setValue('unit', val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Create account
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
