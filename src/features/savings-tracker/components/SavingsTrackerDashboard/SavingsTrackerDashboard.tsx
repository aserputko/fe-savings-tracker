import { useSavingsGoals } from '../../hooks';
import { SavingsGoalGrid } from '../SavingsGoalGrid';
import { SavingsTrackerLayout } from '../SavingsTrackerLayout';

export function SavingsTrackerDashboard() {
  const { data, isLoading } = useSavingsGoals();

  return (
    <SavingsTrackerLayout>
      <div className='flex flex-col gap-6'>
        <h2 className='text-preset-3 text-neutral-0'>Your goals</h2>
        {isLoading && <p className='text-preset-5 text-neutral-400'>Loading...</p>}
        {data && <SavingsGoalGrid goals={data.data} />}
      </div>
    </SavingsTrackerLayout>
  );
}
