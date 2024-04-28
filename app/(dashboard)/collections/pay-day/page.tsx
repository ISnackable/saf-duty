import {
  addMonths,
  differenceInCalendarDays,
  getDaysInMonth,
  isAfter,
} from 'date-fns';
import type { Metadata } from 'next';

import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const metadata: Metadata = {
  title: 'Pay Day',
  description: 'Pay Day page to view the allowances that you get.',
};

const elements = [
  { rankStarting: 'Recruit (REC) or Private (PTE)', rankAllowance: '$755' },
  { rankStarting: 'Lance-Corporal (LCP)', rankAllowance: '$775' },
  { rankStarting: 'Corporal (CPL)', rankAllowance: '$825' },
  { rankStarting: 'Corporal First Class (CFC)', rankAllowance: '$865' },
  { rankStarting: '3rd Sergeant (3SG)', rankAllowance: '$1,075' },
  { rankStarting: '2nd Sergeant (2SG)', rankAllowance: '$1,175' },
  { rankStarting: '2nd Lieutenant (2LT)', rankAllowance: '$1,275' },
  { rankStarting: 'Lieutenant (LTA)', rankAllowance: '$1,455' },
];
const vocation = [
  {
    vocation: 'Service and Technical vocations',
    vocationAllowance: '$75',
  },
  {
    vocation: 'All combatants except those under S/N 3 and 4',
    vocationAllowance: '$225',
  },
  {
    vocation:
      'Aircrew, Armour, Guards, Infantry Combat Medics, Specialists or Officers in the Medical Response Force or deployed on the Singapore Civil Defence Force ambulances Seagoing',
    vocationAllowance: '$300',
  },
  {
    vocation:
      'Chemical, Biological, Radiological Defence or Explosive Ordinance Disposal, Commandos, Naval Diver',
    vocationAllowance: '$500',
  },
];

// Set the payday date to the 10th of every month
const PAYDAY_DAY = 10;

const TODAY = new Date();

// Calculate the next payday date
let nextPayday = new Date(TODAY);
nextPayday.setDate(PAYDAY_DAY);

// If the 10th day of the current month has already passed, calculate the next month's payday
if (isAfter(TODAY, nextPayday)) {
  nextPayday = addMonths(nextPayday, 1);
}

// Calculate the number of days left until the next payday
const daysLeft = Math.abs(differenceInCalendarDays(TODAY, nextPayday));

// Calculate the total days in the month
const daysTotal = getDaysInMonth(nextPayday);
// Calculate the progress towards the next PAYDAY_DAY as a percentage
const progress = Math.floor(((daysTotal - daysLeft) / daysTotal) * 100);

export default async function CollectionsPayDayPage() {
  const rows = elements.map((element, idx) => (
    <TableRow key={element.rankStarting}>
      <TableCell>{idx + 1}</TableCell>
      <TableCell className='font-medium'>{element.rankStarting}</TableCell>
      <TableCell>{element.rankAllowance}</TableCell>
    </TableRow>
  ));
  const vocations = vocation.map((vocation, idx) => (
    <TableRow key={vocation.vocation}>
      <TableCell>{idx + 1}</TableCell>
      <TableCell className='font-medium'>{vocation.vocation}</TableCell>
      <TableCell>{vocation.vocationAllowance}</TableCell>
    </TableRow>
  ));

  return (
    <div className='space-y-4 p-8 pt-4'>
      <div className='flex w-full items-center space-y-2'>
        <Icons.coin className='mr-3 inline-block h-8 w-8 items-center align-middle' />
        <h1 className='grow scroll-m-20 border-b pb-2 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
          Pay Day
        </h1>
      </div>
      <p className='text-sm leading-7 sm:text-base [&:not(:first-child)]:mt-6'>
        A countdown to the next Pay Day is shown below to help you survive your
        NS experience. Pay Day is on the 10th of every month.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Pay Day Countdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress className='h-4' value={progress} />
        </CardContent>
        <CardFooter className='flex justify-between'>
          <p className='text-sm text-muted-foreground'>
            {100 - progress}% left to next pay day
          </p>
          <Badge variant='secondary'>{daysLeft} days left</Badge>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly rank allowance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Table 1. Current and Revised Monthly NS Allowance (Mindef, 2023)
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Starting Rank Allowance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{rows}</TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly vocation allowance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Table 2. Monthly Vocation Allowance (CMPB, 2024)
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Vocations</TableHead>
                <TableHead>Monthly vocation allowance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{vocations}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
