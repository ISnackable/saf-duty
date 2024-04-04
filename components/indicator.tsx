import { cn } from '@/lib/utils';

export function Indicator({
  disabled = false,
  placement = 'botttom-right',
  className,
  children,
}: {
  disabled?: boolean;
  placement?: 'botttom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  children?: React.ReactNode;
}) {
  const [positionY, positionX] = placement.split('-');
  const placementClass = `${positionY}-0 ${positionX}-0`;

  return (
    <div>
      {!disabled && (
        <div
          className={cn(
            'absolute h-2 w-2 rounded-full border-2 border-background',
            placementClass,
            `bg-primary`,
            className
          )}
        />
      )}
      {children}
    </div>
  );
}
