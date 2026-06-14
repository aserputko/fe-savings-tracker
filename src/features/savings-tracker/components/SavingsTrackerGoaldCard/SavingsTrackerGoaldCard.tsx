import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

export type GoalCardSize = 'default' | 'wide' | 'tall';
export type GoalCardState = 'inProgress' | 'complete' | 'noProgress';

export interface SavingsTrackerGoalCardProps {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date | number | null;
  size?: GoalCardSize;
  state?: GoalCardState;
  className?: string;
  onClick?: () => void;
}

const cardVariants = cva('relative overflow-hidden flex flex-col gap-6 p-6 rounded-2xl border', {
  variants: {
    size: {
      default: 'w-[408px] h-[240px]',
      wide: 'w-[838px] h-[240px]',
      tall: 'w-[408px] h-[504px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDeadline(date: Date | number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(typeof date === 'number' ? new Date(date) : date);
}

export function SavingsTrackerGoalCard({
  goalName,
  targetAmount,
  currentAmount,
  deadline,
  size = 'default',
  state = 'inProgress',
  className,
  onClick,
}: SavingsTrackerGoalCardProps) {
  const isWide = size === 'wide';
  const isComplete = state === 'complete';
  const isNoProgress = state === 'noProgress';

  const percentage =
    targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;
  const displayValue = isNoProgress ? '0' : `${percentage}%`;

  const percentTextColor = isWide
    ? 'text-neutral-0'
    : isComplete
      ? 'text-green-500'
      : isNoProgress
        ? 'text-neutral-400'
        : 'text-orange-400';

  const progressTrackColor = isWide ? 'bg-orange-800' : 'bg-neutral-700';
  const progressFillColor = isWide ? 'bg-neutral-0' : isComplete ? 'bg-green-500' : 'bg-orange-400';
  const progressFillWidth = isNoProgress ? 0 : percentage;

  return (
    <div
      className={cn(
        cardVariants({ size }),
        isWide ? 'border-white/30' : 'bg-neutral-800 border-neutral-600',
        onClick && 'cursor-pointer',
        className,
      )}
      style={
        isWide
          ? {
              backgroundImage:
                'linear-gradient(-83.84786220334723deg, #ff5722 1.4973%, #b92b09 98.503%)',
            }
          : undefined
      }
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Header */}
      <div className='flex items-center gap-2.5 w-full shrink-0'>
        <p className='text-preset-4 text-neutral-0 flex-1 min-w-0'>{goalName}</p>
        {isComplete && (
          <div className='bg-green-900 border border-green-500 flex items-center justify-center px-2.5 py-1 rounded-full shrink-0'>
            <span className='text-preset-7 text-green-500 whitespace-nowrap'>COMPLETE</span>
          </div>
        )}
      </div>

      {/* Content — pushed to bottom */}
      <div className='flex flex-1 flex-col gap-4 items-start justify-end w-full min-h-0'>
        <p className={cn('text-preset-1 whitespace-nowrap shrink-0', percentTextColor)}>
          {displayValue}
        </p>

        <div className={cn('w-full h-3 rounded-full overflow-hidden shrink-0', progressTrackColor)}>
          <div
            className={cn('h-full rounded-lg border border-white/30', progressFillColor)}
            style={{ width: `${progressFillWidth}%` }}
          />
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          <span className='text-preset-6 text-neutral-0 whitespace-nowrap'>
            {formatCurrency(currentAmount)} of {formatCurrency(targetAmount)}
          </span>
          <span className='w-1 h-1 rounded-full bg-neutral-0 shrink-0' />
          <span
            className={cn(
              'text-preset-6 text-neutral-0 whitespace-nowrap',
              !isWide && 'opacity-70',
            )}
          >
            {deadline != null ? `Due ${formatDeadline(deadline)}` : 'No deadline'}
          </span>
        </div>
      </div>
    </div>
  );
}
