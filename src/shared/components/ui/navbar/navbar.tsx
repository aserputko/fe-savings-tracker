import logoSmall from '@/assets/images/logo-small.svg';

import { Button } from '@/shared/components/ui/button';

export interface NavbarProps {
  onNewGoal?: () => void;
}

export function Navbar({ onNewGoal }: NavbarProps) {
  return (
    <header className='flex items-center justify-between border-b border-neutral-800 px-4 py-3 md:h-20 md:px-6 md:py-0'>
      <div className='flex items-center gap-2.5'>
        <img src={logoSmall} alt='Savings Tracker logo' className='size-10 shrink-0' />
        <span className='hidden md:inline text-preset-3 text-neutral-0 whitespace-nowrap'>
          Savings Tracker
        </span>
      </div>
      <Button variant='primary' leftIcon='plus' onClick={onNewGoal} className='xl:w-[140px]'>
        New goal
      </Button>
    </header>
  );
}
