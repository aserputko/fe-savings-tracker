import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const QUOTES = [
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
] as const;

async function renderAuthQuoteWithRandom(randomValue: number) {
  vi.spyOn(Math, 'random').mockReturnValue(randomValue);
  vi.resetModules();
  const { AuthQuote } = await import('./AuthQuote');
  return render(<AuthQuote />);
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AuthQuote', () => {
  it('GIVEN the component WHEN rendered THEN a blockquote with one of the known quotes is visible', async () => {
    await renderAuthQuoteWithRandom(0);

    const blockquote = screen.getByRole('blockquote', { hidden: true });
    expect(blockquote).toBeInTheDocument();

    const quoteTexts = QUOTES.map((q) => `\u201C${q.text}\u201D`);
    const renderedText = blockquote.textContent ?? '';
    expect(quoteTexts.some((t) => renderedText.includes(t))).toBe(true);

    const renderedAuthor = QUOTES.find((q) => renderedText.includes(q.text))?.author;
    expect(renderedAuthor).toBeDefined();
    expect(renderedText).toContain(`\u2014 ${renderedAuthor as string}`);
  });

  it.each([
    [0, 0],
    [0.4, 1],
    [0.99, 2],
  ])(
    'GIVEN Math.random returns %s WHEN rendered THEN quote at index %s is shown',
    async (randomValue, expectedIndex) => {
      await renderAuthQuoteWithRandom(randomValue);

      const expected = QUOTES[expectedIndex];
      expect(screen.getByText(`\u201C${expected.text}\u201D`)).toBeInTheDocument();
      expect(screen.getByText(`\u2014 ${expected.author}`)).toBeInTheDocument();
    },
  );

  it('GIVEN the component WHEN rendered THEN the decorative star image is non-semantic', async () => {
    const { container } = await renderAuthQuoteWithRandom(0);

    const decorativeImg = container.querySelector('img[aria-hidden="true"]');
    expect(decorativeImg).not.toBeNull();
    expect(decorativeImg).toHaveAttribute('alt', '');
  });
});
