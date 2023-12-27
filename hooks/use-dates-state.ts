import { addDays } from 'date-fns';
import { useState } from 'react';
import { type DateRange, type DaySelectionMode } from 'react-day-picker';

export type DateState = Date | Date[] | DateRange | undefined;
export type DateType<T> = T extends 'single'
  ? Date | undefined
  : T extends 'multiple'
    ? Date[] | undefined
    : T extends 'range'
      ? DateRange | undefined
      : never;

export function useDateState<T extends DaySelectionMode>(
  mode: T
): [DateType<T>, (newDate: DateType<T>) => void] {
  const [date, setDate] = useState<DateType<T>>(() => {
    switch (mode) {
      case 'single':
        return new Date() as DateType<T>;
      case 'range':
        return {
          from: new Date(),
          to: addDays(new Date(), 5),
        } as DateType<T>;
      case 'multiple':
        return [new Date(), addDays(new Date(), 5)] as DateType<T>;
      default:
        return undefined as DateType<T>;
    }
  });

  const setDateState = (newDate: DateType<T>) => {
    if (typeof newDate !== 'undefined') {
      setDate(newDate);
    }
  };

  return [date, setDateState];
}
