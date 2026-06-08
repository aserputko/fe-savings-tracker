import logoSmall from '@/assets/images/logo-small.svg'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <img src={logoSmall} alt="Savings Tracker logo" className="size-10 shrink-0" />
      <span className="text-preset-3 text-neutral-0 whitespace-nowrap">Savings Tracker</span>
    </div>
  )
}
