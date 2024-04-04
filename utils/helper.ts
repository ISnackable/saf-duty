import { format, isMatch } from 'date-fns';

import { demo } from '../site.config';

export function indexOnce<T extends { id: string }>(data: T[]) {
  return data.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, T>
  );
}

export function indexOnceWithKey<T, K extends keyof T>(data: T[], key: K) {
  return data.reduce(
    (acc, item) => {
      acc[item[key] as string] = item;
      return acc;
    },
    {} as Record<string, T>
  );
}

export function isDemoUser(userId: string): boolean {
  return userId === demo.id;
}

export function getMonthYearParams(params: Record<string, string> | undefined) {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Get month and year from params
  if (
    params?.month &&
    params?.year &&
    isMatch(`${params?.month}-${params?.year}`, 'MMMM-yyyy')
  )
    return { month: params?.month, year: params?.year };

  return {
    month: format(today, 'LLLL'),
    year: currentYear.toString(),
  };
}

export function useMonthYear(searchParams: URLSearchParams) {
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  if (month && year && isMatch(`${month}-${year}`, 'MMMM-yyyy')) {
    return { month, year };
  } else if (month && isMatch(month, 'MMMM')) {
    const currentYear = new Date().getFullYear();
    return { month, year: currentYear.toString() };
  } else if (year && isMatch(year, 'yyyy')) {
    const currentMonth = format(new Date(), 'LLLL');
    return { month: currentMonth, year };
  }

  const today = new Date();
  const currentYear = today.getFullYear();

  return {
    month: format(today, 'LLLL'),
    year: currentYear.toString(),
  };
}
