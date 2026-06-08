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
      <blockquote className="relative h-full flex-auto flex flex-col gap-4">
        <div className="flex flex-col h-full items-center justify-center">
          <p className="text-preset-1 text-neutral-0">
            &ldquo;{randomQuote.text}&rdquo;
          </p>
        </div>
        <footer className="text-preset-4 text-neutral-0 ">
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
