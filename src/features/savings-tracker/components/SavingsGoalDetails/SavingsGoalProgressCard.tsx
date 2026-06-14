import { cn } from '@/lib/utils';
import type { SavingsGoalResponseDto } from '../../../../api/generated';

interface SavingsGoalProgressCardProps {
  goal: SavingsGoalResponseDto;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function derivePercentage(currentAmount: number, targetAmount: number): number {
  if (targetAmount <= 0) return 0;
  return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
}

export function SavingsGoalProgressCard({ goal }: SavingsGoalProgressCardProps) {
  const { targetAmount, currentAmount } = goal;

  const isComplete = targetAmount > 0 && currentAmount >= targetAmount;
  const isNoProgress = currentAmount === 0;

  const percentage = derivePercentage(currentAmount, targetAmount);
  const remaining = Math.max(0, targetAmount - currentAmount);

  const percentColor = isComplete
    ? 'text-green-500'
    : isNoProgress
      ? 'text-neutral-400'
      : 'text-orange-400';

  const fillColor = isComplete ? 'bg-green-500' : 'bg-orange-400';

  return (
    <div className='bg-neutral-800 border border-neutral-600 rounded-2xl p-6 flex flex-col gap-6 w-full'>
      {/* Progress info */}
      <div className='flex items-center justify-between'>
        <p className={`text-preset-1-mobile sm:text-preset-1 whitespace-nowrap ${percentColor}`}>
          {isNoProgress ? '0%' : `${percentage}%`}
        </p>
        <p className='text-preset-4 text-neutral-300 whitespace-nowrap'>
          {formatCurrency(remaining)} remaining
        </p>
      </div>

      {/* Progress bar */}
      <div className='flex flex-col gap-4'>
        <div className='w-full h-3 rounded-full overflow-hidden bg-neutral-700'>
          <div
            className={cn('h-full rounded-lg border border-white/30', fillColor)}
            style={{ width: `${isNoProgress ? 0 : percentage}%` }}
          />
        </div>

        {/* Saved / Target summary */}
        <div className='flex items-start justify-between'>
          <div className='flex flex-col gap-1'>
            <p className='text-preset-6 text-neutral-0'>{formatCurrency(currentAmount)}</p>
            <p className='text-preset-6 text-neutral-300'>Saved so far</p>
          </div>
          <div className='flex flex-col gap-1 items-end'>
            <p className='text-preset-6 text-neutral-0'>of {formatCurrency(targetAmount)}</p>
            <p className='text-preset-6 text-neutral-300'>Target</p>
          </div>
        </div>
      </div>
    </div>
  );
}
