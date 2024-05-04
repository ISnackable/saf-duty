'use client';

import type { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Profiles } from '@/lib/supabase/queries';

const TODAY = new Date();

export const columns: ColumnDef<Profiles>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <Icons.arrowsSort className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='ml-2 flex items-center align-middle'>
        <Avatar className='mr-2 size-8'>
          <AvatarImage
            loading='lazy'
            src={row.original.avatar_url as string}
            alt={row.original.name}
            className='object-cover'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className='text-sm font-medium leading-none'>
          {row.original.name}
        </span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'total_duty_done',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Duty Done
          <Icons.arrowsSort className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.total_duty_done[0].count;
      return <div className='px-4 font-medium'>{value}</div>;
    },
  },
  {
    accessorKey: 'weekday_points',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          WD Points
          <Icons.arrowsSort className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.weekday_points;
      return <div className='px-4 font-medium'>{value}</div>;
    },
  },
  {
    accessorKey: 'weekend_points',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          WE Points
          <Icons.arrowsSort className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.weekend_points;
      return <div className='px-4 font-medium'>{value}</div>;
    },
  },
  {
    accessorKey: 'no_of_extras',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Extras
          <Icons.arrowsSort className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.no_of_extras;
      return <div className='px-4 font-medium'>{value}</div>;
    },
  },
  {
    accessorKey: 'ord_date',
    id: 'ord_progress',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ORD Progress
          <Icons.arrowsSort className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.ord_date;
      if (!value) return <div className='px-4 font-medium'>N/A</div>;

      let totalDuration = new Date(value).getTime() - TODAY.getTime();
      if (totalDuration < 0) return 'OWADIO';
      else if (totalDuration >= 730 * (1000 * 3600 * 24))
        totalDuration = 730 * (1000 * 3600 * 24);

      const totalDays = Math.floor(totalDuration / (1000 * 3600 * 24));
      const progress = Math.floor(100 - (totalDays / 730) * 100);

      return <Progress value={progress} />;
    },
  },
];
