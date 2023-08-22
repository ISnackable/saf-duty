/* eslint-disable */
/**
 * @fileoverview
 * This file contains the code for generating a duty roster for a given set of people.
 * The roster is generated by randomly assigning people to a given number of shifts.
 * It uses the Round-robin algorithm algorithm to generate the roster.
 */
import dayjs from 'dayjs'
import type { AllSanityUser, Roster } from '@/lib/sanity.queries'

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
] as const

export type MonthName = (typeof MONTH_NAMES)[number]
export interface Personnel extends Omit<AllSanityUser, 'blockouts'> {
  id: string
  // name: string
  weekdayPoints: number
  weekendPoints: number
  extra: number
  blockouts?: Date[]
  WD_RM: number // Weekday Remaining
  SBWD_RM: number // Stand In/Stand By weekend
  WD_DONE: number // No. Weekdays duty assigned
  WE_RM: number // Weekend Remaining
  SBWE_RM: number // Stand In/Stand By weekend
  WE_DONE: number // No. Weekends duty assigned
  SB_COUNT: number // Total stand in count
  EX_DONE: number // Extras Cleared,
}

export interface DutyDate extends Omit<Roster, 'date' | 'personnel' | 'standby'> {
  date: Date
  isExtra: boolean
  isWeekend: boolean
  blockout: Personnel['name'][]
  personnel: Personnel['name'] | null
  standby: Personnel['name'] | null
  allocated: boolean
}

function getDatesInMonth(date: Date): Date[] {
  const datesInMonth = []
  const firstDay = dayjs(date).startOf('month')
  const daysInMonth = firstDay.daysInMonth()

  for (let i = 0; i < daysInMonth; i++) {
    datesInMonth.push(firstDay.add(i, 'day').toDate())
  }

  return datesInMonth
}

/**
 *
 * The method returns an integer from 0 (January) to 11 (December).
 * @param month
 * @returns integer representing the month number (0-11)
 */
export function getMonthCount(month: MonthName) {
  return dayjs(new Date(`${month} 1`)).month()
}

/**
 * The method returns true if the date is a weekend
 * @param date
 * @returns true if the date is a Sunday or Saturday, false otherwise
 * @example isWeekend(new Date(2021, 0, 1))
 */
export function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
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
    return d.getTime() == value.getTime()
  })
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
  )
}

/**
 * The method shuffles an array
 * @param array
 * @returns a shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  const arrayCopy = [...array]
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]
  }
  return arrayCopy
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
    let x = a[key]
    let y = b[key]
    if (reversed) {
      ;[x, y] = [y, x]
    }
    return x < y ? -1 : x > y ? 1 : 0
  })
}

/**
 * @param personnel
 * @returns a new array of personnel with extra details for the duty roster
   @example { id: 1, name: "John", weekdayPoints: 0, weekendPoints: 0, extra: 0, blockoutDates: [] },
 */
function createDutyPersonnel(personnel: AllSanityUser[]): Personnel[] {
  return personnel.map((person) => ({
    ...person,
    blockouts: person.blockouts?.map((blockout) => new Date(blockout)) ?? [],
    weekdayPoints: person.weekdayPoints ?? 0, // Weekday Pts next month
    weekendPoints: person.weekendPoints ?? 0, // Weekend Pts next month
    extra: person.extra ?? 0, // Extra Remaining
    WD_RM: 0, // Weekday Remaining
    SBWD_RM: 0, // Stand In/Stand By weekend
    WD_DONE: 0, // No. Weekdays duty assigned
    WE_RM: 0, // Weekend Remaining
    SBWE_RM: 0, // Stand In/Stand By weekend
    WE_DONE: 0, // No. Weekends duty assigned
    SB_COUNT: 0, // Total stand in count
    EX_DONE: 0, // Extra Cleared,
  }))
}

/**
 * @param date An array of dates in the month
 * @returns An array of objects with the date, isWeekend and isBlockout properties
 */
function createDutyDate(personnel: Personnel[], date: Date[], extraDates: Date[]): DutyDate[] {
  return date.map((date) => {
    const blockoutPersonnels = personnel
      .filter((person) => {
        const blockoutTime =
          person.blockouts?.map((blockout) => blockout.setHours(0, 0, 0, 0)) ?? []

        return blockoutTime.includes(date.setHours(0, 0, 0, 0))
      })
      .map((person) => person.name)

    return {
      date: date,
      isExtra: isDateInArray(extraDates, date),
      isWeekend: isWeekend(date),
      blockout: blockoutPersonnels,
      personnel: null,
      standby: null,
      allocated: false,
    }
  })
}

function calculateWeekdayShift(personnel: Personnel[], dutyDates: DutyDate[]) {
  // total_wd = total_days - total_we - len(extradates) + non_allocated_extras
  // const totalWeekendDays = dutyDates.filter((date) => date.isWeekend).length
  // const totalExtraDays = dutyDates.filter((date) => date.isExtra).length
  const totalPersonnel = personnel.length

  // Number of extra days that are not allocated
  // const nonAllocatedExtra = dutyDates.filter((date) => date.isExtra && !date.allocated).length

  // const totalWeekdayDays = dutyDates.length - totalWeekendDays - totalExtraDays + nonAllocatedExtra
  const totalWeekdayDays = dutyDates.filter((date) => !date.isWeekend).length

  // Calculate normal WD per personnel
  const weekdayAllocation = Math.floor(totalWeekdayDays / totalPersonnel)
  // Number of people doing an additional weekday
  const additionalWeekdayAllocation = totalWeekdayDays - totalPersonnel * weekdayAllocation

  return { weekdayAllocation, additionalWeekdayAllocation }
}

function calculateWeekendShift(personnel: Personnel[], dutyDates: DutyDate[]) {
  const totalExtraDays = dutyDates.filter((date) => date.isExtra).length
  const nonAllocatedExtra = dutyDates.filter((date) => date.isExtra && !date.allocated).length

  const totalWeekendDays =
    dutyDates.filter((date) => date.isWeekend).length - totalExtraDays + nonAllocatedExtra

  const totalPersonnel = personnel.length

  // Calculate normal weekend per personnel
  const weekendAllocation = Math.floor(totalWeekendDays / totalPersonnel)
  // Number of people doing an additional weekday
  const additionalWeekendAllocation = totalWeekendDays - totalPersonnel * weekendAllocation

  return { weekendAllocation, additionalWeekendAllocation }
}

function allocateWeekdayShift(
  personnel: Personnel[],
  weekdayAllocation: number,
  additionalWeekdayAllocation: number,
) {
  let shuffledDutyPersonnel = shuffleArray(personnel)
  shuffledDutyPersonnel = sortByKey(shuffledDutyPersonnel, 'weekdayPoints')

  // Allocate normal weekdays
  for (let person of shuffledDutyPersonnel.slice(0, additionalWeekdayAllocation)) {
    person.WD_RM = weekdayAllocation + 1
    person.weekdayPoints += 1
  }

  // Allocate additional weekdays
  for (let person of shuffledDutyPersonnel.slice(additionalWeekdayAllocation)) {
    person.WD_RM = weekdayAllocation
    person.weekdayPoints -= 1
  }

  return true
}

function allocateWeekendShift(
  personnel: Personnel[],
  weekendAllocation: number,
  additionalWeekendAllocation: number,
) {
  let shuffledDutyPersonnel = shuffleArray(personnel)
  // shuffledDutyPersonnel = sortByKey(shuffledDutyPersonnel, 'WD_RM')
  // Sort by two values priortizing WD_RM then weekendPoints
  shuffledDutyPersonnel.sort((a, b) => a.WD_RM - b.WD_RM || a.weekendPoints - b.weekendPoints)

  // Allocate normal weekends
  for (let person of shuffledDutyPersonnel.slice(0, additionalWeekendAllocation)) {
    person.WE_RM = weekendAllocation + 1
    person.weekendPoints += 1
  }

  // Allocate additional weekends
  for (let person of shuffledDutyPersonnel.slice(additionalWeekendAllocation)) {
    person.WE_RM = weekendAllocation
    person.weekendPoints -= 1
  }

  return true
}

function assignPersonnelShift(personnel: Personnel[], dutyDates: DutyDate[]) {
  for (let i = 0; i < dutyDates.length; ++i) {
    if (!dutyDates[i].isWeekend && !dutyDates[i].allocated) {
      // Assign weekday duty
      personnel = shuffleArray(personnel)
      personnel = sortByKey(personnel, 'WD_RM', true)

      let j = 0
      while (dutyDates[i].blockout.includes(personnel[j].name) || personnel[j].WD_RM == 0) {
        j += 1
        if (j === personnel.length) {
          throw new Error(`Unable to assign personnel on ${dutyDates[i].date.toLocaleDateString()}`)
        }
      }

      dutyDates[i].personnel = personnel[j].name
      personnel[j].WD_RM -= 1
      personnel[j].WD_DONE += 1
      if (i >= 0 && i < dutyDates.length - 1) {
        dutyDates[i + 1].blockout.push(personnel[j].name)
      }
      if (i > 0 && i <= dutyDates.length - 1) {
        dutyDates[i - 1].blockout.push(personnel[j].name)
      }

      personnel = shuffleArray(personnel)
      personnel = sortByKey(personnel, 'SB_COUNT', false)

      j = 0
      while (
        dutyDates[i].blockout.includes(personnel[j].name) ||
        personnel[j].name == dutyDates[i].personnel
      ) {
        j += 1
        if (j == personnel.length - 1) {
          throw new Error(`Unable to assign stand in on ${dutyDates[i].date.toLocaleDateString()}`)
        }
      }
      dutyDates[i].standby = personnel[j].name
      if (i >= 0 && i < dutyDates.length - 1) {
        dutyDates[i + 1].blockout.push(personnel[j].name)
      }
      if (i > 0 && i <= dutyDates.length - 1) {
        dutyDates[i - 1].blockout.push(personnel[j].name)
      }
      personnel[j].SB_COUNT += 1
    } else if (dutyDates[i].isWeekend && !dutyDates[i].allocated) {
      // Assign weekend duty
      personnel = shuffleArray(personnel)
      personnel = sortByKey(personnel, 'WE_RM', true)

      let j = 0
      while (dutyDates[i].blockout.includes(personnel[j].name) || personnel[j].WE_RM == 0) {
        j += 1
        if (j === personnel.length - 1) {
          throw new Error(`Unable to assign personnel on ${dutyDates[i].date.toLocaleDateString()}`)
        }
      }
      dutyDates[i].personnel = personnel[j].name
      personnel[j].WE_RM -= 1
      personnel[j].WE_DONE += 1
      if (i >= 0 && i < dutyDates.length - 1) {
        dutyDates[i + 1].blockout.push(personnel[j].name)
      }
      if (i > 0 && i <= dutyDates.length - 1) {
        dutyDates[i - 1].blockout.push(personnel[j].name)
      }
      personnel = shuffleArray(personnel)
      personnel = sortByKey(personnel, 'SB_COUNT')

      j = 0
      while (
        dutyDates[i].blockout.includes(personnel[j].name) ||
        personnel[j].name == dutyDates[i].personnel
      ) {
        j += 1
        if (j == personnel.length - 1) {
          throw new Error(`Unable to assign stand in on ${dutyDates[i].date.toLocaleDateString()}`)
        }
      }
      dutyDates[i].standby = personnel[j].name
      if (i >= 0 && i < dutyDates.length - 1) {
        dutyDates[i + 1].blockout.push(personnel[j].name)
      }
      if (i > 0 && i <= dutyDates.length - 1) {
        dutyDates[i - 1].blockout.push(personnel[j].name)
      }
      personnel[j].SB_COUNT += 1
    }
  }

  return { dutyDates, dutyPersonnel: personnel }
}

function assignExtraShift(personnel: Personnel[], dutyDates: DutyDate[]) {
  for (let i = 1; i < dutyDates.length; ++i) {
    if (!dutyDates?.[i - 1].isExtra) continue

    personnel = shuffleArray(personnel)
    personnel = sortByKey(personnel, 'extra', true)

    let j = 0
    while (dutyDates[i - 1].blockout.includes(personnel[j].name) || personnel[j].extra == 0) {
      j += 1
      if (j === personnel.length - 1) return false
    }

    // Assign Extra shift to person who has worked the least Extras
    dutyDates[i - 1].personnel = `${personnel[j].name} EX`

    personnel[j].extra -= 1
    personnel[j].EX_DONE += 1

    if (i - 1 >= 0 && i - 1 < dutyDates.length - 1) {
      // Prevent person from working two Extra shifts in a row
      dutyDates[i].blockout.push(personnel[j].name)
    }
    if (i - 1 > 0 && i - 1 <= dutyDates.length - 1) {
      // Prevent person from working two Extra shifts in a row
      dutyDates[i - 2].blockout.push(personnel[j].name)
    }

    personnel = shuffleArray(personnel)
    personnel = sortByKey(personnel, 'SB_COUNT')

    j = 0
    while (
      dutyDates[i - 1].blockout.includes(personnel[j].name) ||
      dutyDates[i - 1].personnel === personnel[j].name
    ) {
      j += 1
    }
    // Assign Standby shift to person who has worked the least Standby shifts
    dutyDates[i - 1].standby = personnel[j].name
    personnel[j].SB_COUNT += 1
    if (i - 1 >= 0 && i - 1 < dutyDates.length - 1) {
      // Prevent person from working two Standby shifts in a row
      dutyDates[i].blockout.push(personnel[j].name)
    }
    if (i - 1 > 0 && i - 1 <= dutyDates.length - 1) {
      // Prevent person from working two Standby shifts in a row
      dutyDates[i - 2].blockout.push(personnel[j].name)
    }

    dutyDates[i - 1].allocated = true
  }
  return true
}

// This function creates the duty roster, returns a boolean value to indicate if the roster is created successfully
export function createDutyRoster(users: AllSanityUser[], month: Date, extraDates: Date[]) {
  const dutyPersonnel = createDutyPersonnel(users)
  const dutyDates = createDutyDate(dutyPersonnel, getDatesInMonth(month), extraDates)

  // Assign Extra shift
  assignExtraShift(dutyPersonnel, dutyDates)

  // Calculate WD and WE allocation
  const { weekdayAllocation, additionalWeekdayAllocation } = calculateWeekdayShift(
    dutyPersonnel,
    dutyDates,
  )
  const { weekendAllocation, additionalWeekendAllocation } = calculateWeekendShift(
    dutyPersonnel,
    dutyDates,
  )

  // Allocate WD and WE to personnel
  allocateWeekdayShift(dutyPersonnel, weekdayAllocation, additionalWeekdayAllocation)
  allocateWeekendShift(dutyPersonnel, weekendAllocation, additionalWeekendAllocation)

  // Assign WD and WE to dutyDates
  return assignPersonnelShift(dutyPersonnel, dutyDates)
}
