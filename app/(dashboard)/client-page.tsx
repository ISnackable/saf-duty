'use client';

import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { ComboBox, Item } from '@/components/combo-box';
import { DatePicker } from '@/components/date-picker';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: CalendarIcon,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: AvatarIcon,
  },
  {
    value: 'in progress',
    label: 'In Progress',
  },
  {
    value: 'done',
    label: 'Done',
  },
  {
    value: 'canceled',
    label: 'Canceled',
  },
];

function AvatarIcon() {
  return (
    <Avatar className='mr-2 h-8 w-8'>
      <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export function ClienTestPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selected, setSelected] = React.useState<Item | null>(null);

  return (
    <div>
      <ThemeSwitcher />

      <DatePicker mode='single' selected={date} onSelect={setDate} />

      <ComboBox
        items={statuses}
        selected={selected}
        onSelect={setSelected}
        searchable
      />
    </div>
  );
}
