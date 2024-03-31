import { format, isMatch } from 'date-fns';

export const getSearchParams = (url: string) => {
  // Create a params object
  let params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};

export const getMonthYearParams = (
  params: Record<string, string> | undefined
) => {
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
};

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
