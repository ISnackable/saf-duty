'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/button';

interface SettingsNav extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SettingsNav({ className, items, ...props }: SettingsNav) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex flex-wrap space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 ',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'flex-grow justify-start'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
