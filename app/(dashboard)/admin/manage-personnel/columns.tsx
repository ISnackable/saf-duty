'use client';

import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/number-input';
import type { ColumnDef, RowData } from '@tanstack/react-table';
import * as React from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Profiles } from '@/lib/supabase/queries';

import { DeleteTasksDialog } from './manage-personnel-delete-dialog';
import { EditProfileDialog } from './manage-personnel-edit-dialog';

type Option = {
  label: string;
  value: string;
};

declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    // eslint-disable-next-line unused-imports/no-unused-vars
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    title?: string;
    type?: React.HTMLInputTypeAttribute;
    options?: Option[];
  }
}

const TabelCell: ColumnDef<Profiles>['cell'] = ({
  getValue,
  row,
  column,
  table,
}) => {
  const initialValue = getValue() as any;
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = React.useState(initialValue);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const updateBlockouts = useDebouncedCallback(async (value: number) => {
    setIsLoading(true);

    const response = await fetch(
      `/api/profiles/${row.original.id}/max-blockouts`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ max_blockouts: value }),
      }
    );

    const { message } = await response.json();

    if (!response.ok) {
      toast.error(message);
      setValue(initialValue);
      setIsLoading(false);
      return;
    }

    tableMeta?.updateData(row.index, column.id, value);
    toast.success(`Successfully updated maximum blockouts to ${value}`);
    setIsLoading(false);
  }, 800);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    tableMeta?.updateData(row.index, column.id, value);
    setValue(e.target.value);
  };

  const onSelectChange = async (value: string) => {
    setIsLoading(true);

    const response = await fetch(`/api/profiles/${row.original.id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: value }),
    });

    const { message } = await response.json();

    if (!response.ok) {
      toast.error(message);
      setValue(initialValue);
      setIsLoading(false);
      return;
    }

    setValue(value);
    tableMeta?.updateData(row.index, column.id, value);
    toast.success(`Successfully updated role to ${value}`);
    setIsLoading(false);
  };

  switch (columnMeta?.type) {
    case 'select':
      return (
        <Select
          disabled={isLoading}
          onValueChange={onSelectChange}
          value={value}
          defaultValue={initialValue}
        >
          <SelectTrigger className='w-[180px] border-none'>
            <SelectValue
              placeholder={column.columnDef.meta?.title || 'Title'}
            />
          </SelectTrigger>
          <SelectContent>
            {columnMeta?.options?.map((option: Option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'number':
      return (
        <NumberInput
          isDisabled={isLoading}
          title={column.columnDef.meta?.title || 'Title'}
          min={0}
          max={31}
          value={value}
          onChange={(valueAsString, valueAsNumber) => {
            setValue(valueAsString);

            updateBlockouts(valueAsNumber);
          }}
        >
          <NumberInputField className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50' />
          <NumberInputStepper className='w-6 divide-y border-l border-input'>
            <NumberIncrementStepper className='rounded-tr-md border-input text-[0.75rem]' />
            <NumberDecrementStepper className='rounded-br-md border-input text-[0.75rem]' />
          </NumberInputStepper>
        </NumberInput>
      );

    default:
      return (
        <Input
          disabled={isLoading}
          title={column.columnDef.meta?.title || 'Title'}
          type={column.columnDef.meta?.type || 'text'}
          value={value}
          onChange={onChange}
        />
      );
  }
};

export const columns: ColumnDef<Profiles>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 20,
  },
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
      <div className='flex items-center align-middle'>
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
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: TabelCell,
    meta: {
      title: 'User',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
      ],
    },
  },
  {
    accessorKey: 'max_blockouts',
    header: 'Maximum No. of Blockouts',
    cell: TabelCell,
    meta: {
      title: 'Maximum No. of Blockouts',
      type: 'number',
    },
  },
  {
    id: 'actions',
    cell: function Cell({ row }) {
      const profile = row.original;
      const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
        React.useState(false);
      const [showEditTaskDialog, setShowEditTaskDialog] = React.useState(false);

      return (
        <>
          <EditProfileDialog
            profile={row}
            open={showEditTaskDialog}
            onOpenChange={setShowEditTaskDialog}
            showTrigger={false}
          />
          <DeleteTasksDialog
            open={showDeleteTaskDialog}
            onOpenChange={setShowDeleteTaskDialog}
            tasks={[row]}
            showTrigger={false}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
              >
                <Icons.dots className='h-4 w-4' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(profile.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowEditTaskDialog(true)}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-destructive'
                onSelect={() => setShowDeleteTaskDialog(true)}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    enableHiding: false,
    size: 20,
  },
];
