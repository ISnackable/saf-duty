'use client';

import * as React from 'react';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = showPassword ? 'text' : 'password';

    return (
      <div className='relative'>
        <input
          type={inputType}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />

        <button
          type='button'
          className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3'
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <Icons.eye className='h-4 w-4 text-gray-500' />
          ) : (
            <Icons.eyeOff className='h-4 w-4 text-gray-500' />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
