import { useState } from 'react';

import { Layout } from '@/shared/components/ui/layout/layout';

import { CreateSavingsGoalDialog } from '@/features/savings-goal/components/CreateSavingsGoalDialog';

export function DashboardView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Layout onNewGoal={() => setIsDialogOpen(true)}>
        <p className='text-neutral-300 text-preset-5'>Dashboard</p>
      </Layout>
      <CreateSavingsGoalDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
