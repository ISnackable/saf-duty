'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { resetPassword } from '@/app/(auth)/actions';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResetFormSchema } from '@/utils/auth-validation';
import { cn } from '@/utils/cn';

type UserResetFormProps = React.HTMLAttributes<HTMLDivElement>;

export type ResetFormData = z.infer<typeof ResetFormSchema>;

export function UserResetForm({ className, ...props }: UserResetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(ResetFormSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function handleResetForm(data: ResetFormData) {
    setIsLoading(true);
    const { status, message } = await resetPassword(data);

    if (status === 'error') {
      toast.error(message || 'Something went wrong.', {
        description: 'Make sure you entered the correct email.',
      });
    } else {
      toast.success(message || 'Check your email.', {
        description:
          'We sent you a password reset link. Be sure to check your spam too.',
      });
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(handleResetForm)}>
        <div className='grid gap-2'>
          <div className='mb-2 grid gap-1'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className='px-1 text-xs text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            className={cn(buttonVariants())}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            Send Reset Email
          </button>
        </div>
      </form>
    </div>
  );
}
