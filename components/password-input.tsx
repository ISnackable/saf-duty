'use client';

import * as React from 'react';

import { Icons } from '@/components/icons';
import { cn } from '@/utils/cn';

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
            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />

        <button
          type='button'
          className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
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
