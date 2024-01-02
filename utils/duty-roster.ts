/**
 * @fileoverview
 * This file contains the code for generating a duty roster for a given set of people.
 * The roster is generated by randomly assigning people to a given number of shifts.
 * It uses the Round-robin algorithm algorithm to generate the roster.
 */
import { addDays, getDaysInMonth, startOfMonth } from 'date-fns';

type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;

/**
 * Represent a string like `2021-01-08`
 */
export type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export type MonthName = (typeof MONTH_NAMES)[number];
export interface Personnel {
  id: string;
  name: string;
  weekdayPoints: number;
  weekendPoints: number;
  extra: number;
  blockouts?: Date[];
  weekdayRemaining: number; // Weekday Remaining
  reserveWeekdayRemaining: number; // Stand In/Stand By weekend
  totalWeekdayAssigned: number; // No. Weekdays duty assigned
  weekendRemaining: number; // Weekend Remaining
  reserveWeekendRemaining: number; // Stand In/Stand By weekend
  totalWeekendAssigned: number; // No. Weekends duty assigned
  totalReversedAssigned: number; // Total stand in count
  totalExtraAssigned: number; // Extras Cleared,
}

export interface DutyDate {
  date: Date;
  isExtra: boolean;
  isWeekend: boolean;
  blockout: Personnel['name'][];
  personnel: Personnel['name'] | null;
  reservePersonnel: Personnel['name'] | null;
  allocated: boolean;
}

function getDatesInMonth(date: Date): Date[] {
  const datesInMonth = [];
  const firstDay = startOfMonth(date);
  const daysInMonth = getDaysInMonth(date);

  for (let i = 0; i < daysInMonth; i++) {
    datesInMonth.push(addDays(firstDay, i));
  }

  return datesInMonth;
}

/**
 * The method returns true if the date is a weekend
 * @param date
 * @returns true if the date is a Sunday or Saturday, false otherwise
 * @example isWeekend(new Date(2021, 0, 1))
 */
export function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

/**
 * The method returns true if the date is in the array
 * @param array
 * @param value
 * @returns true if the date is in the array, false otherwise
 * @example isDateInArray([new Date(2021, 0, 1)], new Date(2021, 0, 1))
 */
function isDateInArray(array: Date[], value: Date) {
  return !!array.find((d) => {
    return d.getTime() == value.getTime();
  });
}

/**
 * The method returns true if two dates are the same
 * @param date1
 * @param date2
 * @returns true if the dates are the same, false otherwise
 * @example isSameDate(new Date(2021, 0, 1), new Date(2021, 0, 1))
 */
export function isSameDate(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * The method shuffles an array
 * @param array
 * @returns a shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
}

/**
 * @param array an array of objects
 * @param key string or number
 * @param reversed optional boolean
 * @returns a sorted array of objects in accending order unless reversed is true
 * @example sortByKey(personnel, 'id')
 * @example sortByKey(personnel, 'id', true)
 */
function sortByKey<T>(array: T[], key: keyof T, reversed = false) {
  return array.sort(function (a, b) {
    let x = a[key];
    let y = b[key];
    if (reversed) {
      [x, y] = [y, x];
    }
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

/**
 * @param personnel
 * @returns a new array of personnel with extra details for the duty roster
   @example { id: 1, name: "John", weekdayPoints: 0, weekendPoints: 0, extra: 0, blockoutDates: [] },
 */
function createDutyPersonnel(personnel: Personnel[]): Personnel[] {
  return personnel.map((person) => ({
    ...person,
    blockouts: person.blockouts?.map((blockout) => new Date(blockout)) ?? [],
    weekdayPoints: person.weekdayPoints ?? 0, // Weekday Pts next month
    weekendPoints: person.weekendPoints ?? 0, // Weekend Pts next month
    extra: person.extra ?? 0, // Extra Remaining
    weekdayRemaining: 0, // Weekday Remaining
    reserveWeekdayRemaining: 0, // Stand In/Stand By weekend
    totalWeekdayAssigned: 0, // No. Weekdays duty assigned
    weekendRemaining: 0, // Weekend Remaining
    reserveWeekendRemaining: 0, // Stand In/Stand By weekend
    totalWeekendAssigned: 0, // No. Weekends duty assigned
    totalReversedAssigned: 0, // Total stand in count
    totalExtraAssigned: 0, // Extra Cleared,
  }));
}

/**
 * @param date An array of dates in the month
 * @returns An array of objects with the date, isWeekend and isBlockout properties
 */
function createDutyDate(
  personnel: Personnel[],
  date: Date[],
  extraDates: Date[]
): DutyDate[] {
  return date.map((date) => {
    const blockoutPersonnels = personnel
      .filter((person) => {
        const blockoutTime =
          person.blockouts?.map((blockout) => blockout.setHours(0, 0, 0, 0)) ??
          [];

        return blockoutTime.includes(date.setHours(0, 0, 0, 0));
      })
      .map((person) => person.name);

    return {
      date: date,
      isExtra: isDateInArray(extraDates, date),
      isWeekend: isWeekend(date),
      blockout: blockoutPersonnels,
      personnel: null,
      reservePersonnel: null,
      allocated: false,
    };
  });
}

function calculateWeekdayShift(personnel: Personnel[], dutyDates: DutyDate[]) {
  // total_wd = total_days - total_we - len(extradates) + non_allocated_extras
  // const totalWeekendDays = dutyDates.filter((date) => date.isWeekend).length
  // const totalExtraDays = dutyDates.filter((date) => date.isExtra).length
  const totalPersonnel = personnel.length;

  // Number of extra days that are not allocated
  // const nonAllocatedExtra = dutyDates.filter((date) => date.isExtra && !date.allocated).length

  // const totalWeekdayDays = dutyDates.length - totalWeekendDays - totalExtraDays + nonAllocatedExtra
  const totalWeekdayDays = dutyDates.filter((date) => !date.isWeekend).length;

  // Calculate normal WD per personnel
  const weekdayAllocation = Math.floor(totalWeekdayDays / totalPersonnel);
  // Number of people doing an additional weekday
  const additionalWeekdayAllocation =
    totalWeekdayDays - totalPersonnel * weekdayAllocation;

  return { weekdayAllocation, additionalWeekdayAllocation };
}

function calculateWeekendShift(personnel: Personnel[], dutyDates: DutyDate[]) {
  const totalExtraDays = dutyDates.filter((date) => date.isExtra).length;
  const nonAllocatedExtra = dutyDates.filter(
    (date) => date.isExtra && !date.allocated
  ).length;

  const totalWeekendDays =
    dutyDates.filter((date) => date.isWeekend).length -
    totalExtraDays +
    nonAllocatedExtra;

  const totalPersonnel = personnel.length;

  // Calculate normal weekend per personnel
  const weekendAllocation = Math.floor(totalWeekendDays / totalPersonnel);
  // Number of people doing an additional weekday
  const additionalWeekendAllocation =
    totalWeekendDays - totalPersonnel * weekendAllocation;

  return { weekendAllocation, additionalWeekendAllocation };
}

function allocateWeekdayShift(
  personnel: Personnel[],
  weekdayAllocation: number,
  additionalWeekdayAllocation: number
) {
  let shuffledDutyPersonnel = shuffleArray(personnel);
  shuffledDutyPersonnel = sortByKey(shuffledDutyPersonnel, 'weekdayPoints');

  // Allocate normal weekdays
  for (let person of shuffledDutyPersonnel.slice(
    0,
    additionalWeekdayAllocation
  )) {
    person.weekdayRemaining = weekdayAllocation + 1;
    person.weekdayPoints += 1;
  }

  // Allocate additional weekdays
  for (let person of shuffledDutyPersonnel.slice(additionalWeekdayAllocation)) {
    person.weekdayRemaining = weekdayAllocation;
    person.weekdayPoints -= 1;
  }

  return true;
}

function allocateWeekendShift(
  personnel: Personnel[],
  weekendAllocation: number,
  additionalWeekendAllocation: number
) {
  let shuffledDutyPersonnel = shuffleArray(personnel);
  // shuffledDutyPersonnel = sortByKey(shuffledDutyPersonnel, 'weekdayRemaining')
  // Sort by two values priortizing weekdayRemaining then weekendPoints
  shuffledDutyPersonnel.sort(
    (a, b) =>
      a.weekdayRemaining - b.weekdayRemaining ||
      a.weekendPoints - b.weekendPoints
  );

  // Allocate normal weekends
  for (let person of shuffledDutyPersonnel.slice(
    0,
    additionalWeekendAllocation
  )) {
    person.weekendRemaining = weekendAllocation + 1;
    person.weekendPoints += 1;
  }

  // Allocate additional weekends
  for (let person of shuffledDutyPersonnel.slice(additionalWeekendAllocation)) {
    person.weekendRemaining = weekendAllocation;
    person.weekendPoints -= 1;
  }

  return true;
}

function assignPersonnelShift(personnel: Personnel[], dutyDates: DutyDate[]) {
  for (let i = 0; i < dutyDates.length; ++i) {
    if (!dutyDates[i].isWeekend && !dutyDates[i].allocated) {
      // Assign weekday duty
      personnel = shuffleArray(personnel);
      personnel = sortByKey(personnel, 'weekdayRemaining', true);

      let j = 0;
      while (
        dutyDates[i].blockout.includes(personnel[j].name) ||
        personnel[j].weekdayRemaining == 0
      ) {
        j += 1;
        if (j === personnel.length) {
          throw new Error(
            `Unable to assign personnel on ${dutyDates[
              i
            ].date.toLocaleDateString()}`
          );
        }
      }

      dutyDates[i].personnel = personnel[j].name;
      personnel[j].weekdayRemaining -= 1;
      personnel[j].totalWeekdayAssigned += 1;
      if (i >= 0 && i < dutyDates.length - 1) {
        dutyDates[i + 1].blockout.push(personnel[j].name);
      }
      if (i > 0 && i <= dutyDates.length - 1) {
        dutyDates[i - 1].blockout.push(personnel[j].name);
      }

      personnel = shuffleArray(personnel);
      personnel = sortByKey(personnel, 'totalReversedAssigned', false);

      j = 0;
      while (
        dutyDates[i].blockout.includes(personnel[j].name) ||
        personnel[j].name == dutyDates[i].personnel
      ) {
        j += 1;
        if (j == personnel.length - 1) {
          throw new Error(
            `Unable to assign stand in on ${dutyDates[
              i
            ].date.toLocaleDateString()}`
          );
        }
      }
      dutyDates[i].reservePersonnel = personnel[j].name;
      if (i >= 0 && i < dutyDates.length - 1) {
        dutyDates[i + 1].blockout.push(personnel[j].name);
      }
      if (i > 0 && i <= dutyDates.length - 1) {
        dutyDates[i - 1].blockout.push(personnel[j].name);
      }
      personnel[j].totalReversedAssigned += 1;
    } else if (dutyDates[i].isWeekend && !dutyDates[i].allocated) {
      // Assign weekend duty
      personnel = shuffleArray(personnel);
      personnel = sortByKey(personnel, 'weekendRemaining', true);

      let j = 0;
      while (
        dutyDates[i].blockout.includes(personnel[j].name) ||
        personnel[j].weekendRemaining == 0
      ) {
        j += 1;
        if (j === personnel.length - 1) {
          throw new Error(
            `Unable to assign personnel on ${dutyDates[
              i
            ].date.toLocaleDateString()}`
          );
        }
      }
      dutyDates[i].personnel = personnel[j].name;
      personnel[j].weekendRemaining -= 1;
      personnel[j].totalWeekendAssigned += 1;
      if (i >= 0 && i < dutyDates.length - 1) {
        dutyDates[i + 1].blockout.push(personnel[j].name);
      }
      if (i > 0 && i <= dutyDates.length - 1) {
        dutyDates[i - 1].blockout.push(personnel[j].name);
      }
      personnel = shuffleArray(personnel);
      personnel = sortByKey(personnel, 'totalReversedAssigned');

      j = 0;
      while (
        dutyDates[i].blockout.includes(personnel[j].name) ||
        personnel[j].name == dutyDates[i].personnel
      ) {
        j += 1;
        if (j == personnel.length - 1) {
          throw new Error(
            `Unable to assign stand in on ${dutyDates[
              i
            ].date.toLocaleDateString()}`
          );
        }
      }
      dutyDates[i].reservePersonnel = personnel[j].name;
      if (i >= 0 && i < dutyDates.length - 1) {
        dutyDates[i + 1].blockout.push(personnel[j].name);
      }
      if (i > 0 && i <= dutyDates.length - 1) {
        dutyDates[i - 1].blockout.push(personnel[j].name);
      }
      personnel[j].totalReversedAssigned += 1;
    }
  }

  return { dutyDates, dutyPersonnel: personnel };
}

function assignExtraShift(personnel: Personnel[], dutyDates: DutyDate[]) {
  for (let i = 1; i < dutyDates.length; ++i) {
    if (!dutyDates?.[i - 1].isExtra) continue;

    personnel = shuffleArray(personnel);
    personnel = sortByKey(personnel, 'extra', true);

    let j = 0;
    while (
      dutyDates[i - 1].blockout.includes(personnel[j].name) ||
      personnel[j].extra === 0
    ) {
      j += 1;
      // If no one can do extra shift, stop assigning extra shifts
      if (j === personnel.length - 1) return false;
    }

    // Assign Extra shift to person who has worked the least Extras
    dutyDates[i - 1].personnel = personnel[j].name;

    personnel[j].extra -= 1;
    personnel[j].totalExtraAssigned += 1;

    if (i - 1 >= 0 && i - 1 < dutyDates.length - 1) {
      // Prevent person from working two Extra shifts in a row
      dutyDates[i].blockout.push(personnel[j].name);
    }
    if (i - 1 > 0 && i - 1 <= dutyDates.length - 1) {
      // Prevent person from working two Extra shifts in a row
      dutyDates[i - 2].blockout.push(personnel[j].name);
    }

    personnel = shuffleArray(personnel);
    personnel = sortByKey(personnel, 'totalReversedAssigned');

    j = 0;
    while (
      dutyDates[i - 1].blockout.includes(personnel[j].name) ||
      dutyDates[i - 1].personnel === personnel[j].name
    ) {
      j += 1;
    }
    // Assign reservePersonnel shift to person who has worked the least reservePersonnel shifts
    dutyDates[i - 1].reservePersonnel = personnel[j].name;
    personnel[j].totalReversedAssigned += 1;
    if (i - 1 >= 0 && i - 1 < dutyDates.length - 1) {
      // Prevent person from working two reservePersonnel shifts in a row
      dutyDates[i].blockout.push(personnel[j].name);
    }
    if (i - 1 > 0 && i - 1 <= dutyDates.length - 1) {
      // Prevent person from working two reservePersonnel shifts in a row
      dutyDates[i - 2].blockout.push(personnel[j].name);
    }

    dutyDates[i - 1].allocated = true;
  }
  return true;
}

// This function creates the duty roster, returns a boolean value to indicate if the roster is created successfully
export function createDutyRoster({
  users,
  month,
  extraDates,
  omitDates = [],
}: {
  users: Personnel[];
  month: Date;
  extraDates: Date[];
  omitDates?: Date[];
}): { dutyDates: DutyDate[]; dutyPersonnel: Personnel[] } {
  const dutyPersonnel = createDutyPersonnel(users);
  const dutyDates = createDutyDate(
    dutyPersonnel,
    getDatesInMonth(month),
    extraDates
  );

  // Assign Extra shift if there are extra dates
  if (extraDates.length > 0) {
    assignExtraShift(dutyPersonnel, dutyDates);
    // Mark all extra dates as false if they are not allocated
    for (let k = 0; k < dutyDates.length; ++k) {
      if (dutyDates[k].isExtra && !dutyDates[k].allocated) {
        dutyDates[k].isExtra = false;
      }
    }
  }

  // Calculate WD and WE allocation
  const { weekdayAllocation, additionalWeekdayAllocation } =
    calculateWeekdayShift(dutyPersonnel, dutyDates);
  const { weekendAllocation, additionalWeekendAllocation } =
    calculateWeekendShift(dutyPersonnel, dutyDates);

  // Allocate WD and WE to personnel
  allocateWeekdayShift(
    dutyPersonnel,
    weekdayAllocation,
    additionalWeekdayAllocation
  );
  allocateWeekendShift(
    dutyPersonnel,
    weekendAllocation,
    additionalWeekendAllocation
  );

  // Assign WD and WE to dutyDates
  return assignPersonnelShift(dutyPersonnel, dutyDates);
}
