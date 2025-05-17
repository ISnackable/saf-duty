'use client';

import type { Profiles } from '@/lib/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Progress } from '@repo/design-system/components/ui/progress';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';

const TODAY = new Date();

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Profiles> = (
  row,
  _columnId,
  filterValue
) => {
  const searchableRowContent = row.original.name.toLowerCase();
  const searchTerm = (filterValue ?? '').toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export const columns: ColumnDef<Profiles>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="ml-2 flex items-center text-center align-middle">
        <Avatar className="mr-2 flex size-8 items-center align-middle">
          <AvatarImage
            crossOrigin="anonymous"
            loading="lazy"
            src={row.original.image ?? undefined}
            alt={row.original.name}
            className="object-cover"
          />
          <AvatarFallback className="flex">CN</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm leading-none">
          {row.original.name}
        </span>
      </div>
    ),
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Duty's Done",
    cell: ({ row }) => {
      const value = row.original.blockoutDates?.length ?? 0;
      return <div className="px-4 font-medium">{value}</div>;
    },
  },
  {
    header: 'WD Points',
    cell: ({ row }) => {
      const value = row.original.weekdayPoints;
      return <div className="px-4 font-medium">{value}</div>;
    },
  },
  {
    header: 'WE Points',
    cell: ({ row }) => {
      const value = row.original.weekendPoints;
      return <div className="px-4 font-medium">{value}</div>;
    },
  },
  {
    header: 'No. of Extras',
    cell: ({ row }) => {
      const value = row.original.noOfExtras;
      return <div className="px-4 font-medium">{value}</div>;
    },
  },
  {
    header: 'ORD Progress',
    cell: ({ row }) => {
      const value = row.original.ordDate;
      if (!value) {
        return <div className="px-4 font-medium">N/A</div>;
      }

      let totalDuration = new Date(value).getTime() - TODAY.getTime();
      if (totalDuration < 0) {
        return 'OWADIO';
      }

      if (totalDuration >= 730 * (1000 * 3600 * 24)) {
        totalDuration = 730 * (1000 * 3600 * 24);
      }

      const totalDays = Math.floor(totalDuration / (1000 * 3600 * 24));
      const progress = Math.floor(100 - (totalDays / 730) * 100);

      return <Progress value={progress} />;
    },
  },
];
