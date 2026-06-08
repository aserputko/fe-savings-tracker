import patternStar from '@/assets/images/pattern-star.svg';

interface Quote {
  text: string;
  author: string;
}

const QUOTES: Quote[] = [
  {
    text: "The goal isn't to be rich. It's to have enough.",
    author: 'Morgan Housel',
  },
  {
    text: 'Do not save what is left after spending, but spend what is left after saving.',
    author: 'Warren Buffett',
  },
  {
    text: 'A budget is telling your money where to go instead of wondering where it went.',
    author: 'Dave Ramsey',
  },
];

const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

export function AuthQuote() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-orange-400 rounded-3xl m-10 flex-col items-start justify-center p-12 overflow-hidden">
      <blockquote className="relative z-10 flex flex-col gap-4">
        <p className="text-2xl font-bold leading-snug text-neutral-0 tracking-[-0.5px]">
          &ldquo;{randomQuote.text}&rdquo;
        </p>
        <footer className="text-sm font-medium text-neutral-0/80">
          &mdash; {randomQuote.author}
        </footer>
      </blockquote>

      <img
        src={patternStar}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-116 h-116 pointer-events-none"
      />
    </div>
  );
}
