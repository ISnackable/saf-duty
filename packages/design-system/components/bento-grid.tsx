import type * as React from 'react';

import { cn } from '@repo/design-system/lib/utils';

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-input p-4 shadow-input transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:shadow-none',
        className
      )}
    >
      {header}
      <div>
        {icon}
        <div className="mt-2 mb-2 font-bold font-sans text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
        <div className="font-normal font-sans text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
}
