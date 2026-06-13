import { Navbar } from '@/shared/components/ui/navbar';

export interface LayoutProps {
  children: React.ReactNode;
  onNewGoal?: () => void;
}

export function Layout({ children, onNewGoal }: LayoutProps) {
  return (
    <div className='min-h-screen w-full bg-neutral-900'>
      <Navbar onNewGoal={onNewGoal} />
      <main className='px-6 py-12'>{children}</main>
    </div>
  );
}
