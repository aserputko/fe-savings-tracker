import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSavingsGoalById } from '../../hooks';
import { SavingsTrackerLayout } from '../SavingsTrackerLayout';
import { AddDepositForm } from './AddDepositForm';
import { SavingsGoalProgressCard } from './SavingsGoalProgressCard';

function formatDeadline(deadline: object): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(deadline as unknown as string));
}

function formatCreatedAt(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function SavingsGoalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: goal, isLoading, isError } = useSavingsGoalById(id ?? '');

  return (
    <SavingsTrackerLayout>
      <div className='flex flex-col gap-8'>
        {/* Header container */}
        <div className='flex flex-col gap-2.5'>
          {/* Back button row */}
          <div className='flex items-center justify-between'>
            <button
              onClick={() => navigate('/dashboard')}
              className='flex items-center gap-1.5 py-3 text-preset-5 text-neutral-400 hover:text-neutral-300 transition-colors'
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
          </div>

          {isLoading && <p className='text-preset-5 text-neutral-400'>Loading...</p>}

          {isError && <p className='text-preset-5 text-red-500'>Failed to load goal.</p>}

          {goal && (
            <>
              <h1 className='text-preset-1-mobile sm:text-preset-1 text-neutral-0'>{goal.name}</h1>
              <div className='flex items-center gap-3 text-preset-5 text-neutral-300 flex-wrap'>
                {goal.deadline != null && (
                  <>
                    <span>Due {formatDeadline(goal.deadline)}</span>
                    <span className='w-1 h-1 rounded-full bg-neutral-300 shrink-0' />
                  </>
                )}
                <span>Created {formatCreatedAt(goal.createdAt)}</span>
              </div>
            </>
          )}
        </div>

        {/* Content grid: left column (progress + deposit form) | right column (history) */}
        {goal && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
            {/* Left column */}
            <div className='flex flex-col gap-6'>
              <SavingsGoalProgressCard goal={goal} />
              {goal.currentAmount < goal.targetAmount && <AddDepositForm goal={goal} />}
            </div>

            {/* Right column — Deposit history (KAN-48) */}
            <div />
          </div>
        )}
      </div>
    </SavingsTrackerLayout>
  );
}
