import { useState } from 'react';
import { CreateSavingsGoalDialog } from '../SavingsGoalDialog';
import { SavingsTrackerNavbar } from '../SavingsTrackerNavbar';

export interface SavingsTrackerLayoutProps {
  children: React.ReactNode;
}

export function SavingsTrackerLayout({ children }: SavingsTrackerLayoutProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className='min-h-screen w-full bg-neutral-900'>
        <div className='mx-auto max-w-[1440px]'>
          <SavingsTrackerNavbar onNewGoal={() => setIsDialogOpen(true)} />
          <main className='px-6 py-12'>{children}</main>
        </div>
      </div>

      <CreateSavingsGoalDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
