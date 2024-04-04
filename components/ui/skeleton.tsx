import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[#18181b]/10 dark:bg-[#fafafa]/10',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
