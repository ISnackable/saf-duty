import * as React from 'react';

import { cn } from '@/utils/cn';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange(value: string): void;

  /**
   * Number of characters/input for this component
   */
  size?: number;
  /**
   * Validation pattern for each input.
   * e.g: /[0-9]{1}/ for digits only or /[0-9a-zA-Z]{1}/ for alphanumeric
   */
  validationPattern?: RegExp;
}

const PinInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      //Set the default size to 6 characters
      size = 4,
      //Default validation is digits
      validationPattern = /[0-9]{1}/,
      value,
      onChange,
      className,
      type,
      ...props
    },
    ref
  ) => {
    // Create an array based on the size.
    const arr = new Array(size).fill('-');

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const elem = e.target;
      const val = e.target.value;

      // check if the value is valid
      if (!validationPattern.test(val) && val !== '') return;

      // change the value using onChange props
      const valueArr = value.split('');
      valueArr[index] = val;
      const newVal = valueArr.join('').slice(0, size);
      onChange(newVal);

      //focus the next element if there's a value
      if (val) {
        const next = elem.nextElementSibling as HTMLInputElement | null;
        next?.focus();
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const current = e.currentTarget;
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        const prev = current.previousElementSibling as HTMLInputElement | null;
        prev?.focus();
        prev?.setSelectionRange(0, 1);
        return;
      }

      if (e.key === 'ArrowRight') {
        const prev = current.nextSibling as HTMLInputElement | null;
        prev?.focus();
        prev?.setSelectionRange(0, 1);
        return;
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const val = e.clipboardData.getData('text').substring(0, size);
      onChange(val);
    };

    return (
      <div className='flex gap-2' ref={ref}>
        {/* Map through the array and render input components */}
        {arr.map((_, index) => {
          return (
            <input
              title='Pin Input'
              {...props}
              id={`${props.id || ''}-${index}`}
              key={`pin-${index}`}
              className={cn(
                'flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-center text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                className
              )}
              type='text'
              inputMode='numeric'
              autoComplete='one-time-code'
              pattern={validationPattern.source}
              maxLength={size}
              value={value?.at(index) ?? ''}
              onChange={(e) => handleInputChange(e, index)}
              onKeyUp={handleKeyUp}
              onPaste={handlePaste}
            />
          );
        })}
      </div>
    );
  }
);
PinInput.displayName = 'PinInput';

export { PinInput };
