'use client';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { CheckIcon, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/utils/cn';

export type Item = {
  label: string;
  value: string;
  icon?: LucideIcon | React.ComponentType<React.ComponentProps<'svg'>>;
};

interface ComboBoxProps {
  placeholder?: string;
  searchable?: boolean;
  items: Item[];
  selected: Item | null;
  onSelect: (item: Item | null) => void;
}

export function ComboBox({
  placeholder,
  searchable,
  items,
  selected,
  onSelect,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            aria-expanded={open}
            className={cn(
              'w-[150px] justify-between align-middle',
              !selected?.value && 'text-muted-foreground'
            )}
          >
            {selected ? <>{selected.label}</> : <>+ Pick value</>}
            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0' align='start'>
          <Command>
            {searchable && (
              <CommandInput placeholder={placeholder ?? 'Search...'} />
            )}

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(value) => {
                      onSelect(
                        items.find((priority) => priority.value === value) ||
                          null
                      );
                      setOpen(false);
                    }}
                  >
                    {item.icon && (
                      <item.icon className='mr-2 h-4 w-4 text-muted-foreground' />
                    )}
                    {item.label}
                    {item.value === selected?.value ? (
                      <CheckIcon className='h-4 w-4 absolute right-2 flexitems-center justify-center' />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-[150px] justify-between align-middle',
            !selected?.value && 'text-muted-foreground'
          )}
        >
          {selected ? <>{selected.label}</> : <>+ Pick value</>}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mt-4 border-t'>
          <Command>
            {searchable && (
              <CommandInput placeholder={placeholder ?? 'Search...'} />
            )}

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(value) => {
                      onSelect(
                        items.find((priority) => priority.value === value) ||
                          null
                      );
                      setOpen(false);
                    }}
                  >
                    {item.icon && (
                      <item.icon className='mr-2 h-4 w-4 text-muted-foreground' />
                    )}
                    {item.label}
                    {item.value === selected?.value ? (
                      <CheckIcon className='h-4 w-4 absolute right-2 flexitems-center justify-center' />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
