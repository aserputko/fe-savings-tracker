import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DatePicker } from '.';

function Wrapper({
  initialValue,
  onChange,
  ...props
}: {
  initialValue?: Date;
  onChange?: (date: Date | undefined) => void;
} & Omit<React.ComponentProps<typeof DatePicker>, 'value' | 'onChange'>) {
  const [value, setValue] = useState<Date | undefined>(initialValue);
  return (
    <DatePicker
      {...props}
      value={value}
      onChange={(date) => {
        setValue(date);
        onChange?.(date);
      }}
    />
  );
}

describe('DatePicker', () => {
  it('GIVEN default props WHEN rendered THEN trigger input is read-only', () => {
    render(<DatePicker />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  it('GIVEN a value WHEN rendered THEN trigger displays the formatted date', () => {
    render(<DatePicker value={new Date(2026, 5, 1)} />);
    expect(screen.getByRole('textbox')).toHaveValue('01/06/2026');
  });

  it('GIVEN no value WHEN rendered THEN trigger placeholder is shown', () => {
    render(<DatePicker placeholder='dd/mm/yyyy' />);
    expect(screen.getByPlaceholderText('dd/mm/yyyy')).toBeInTheDocument();
  });

  it('GIVEN a label WHEN rendered THEN label text is visible', () => {
    render(<DatePicker label='Deadline' />);
    expect(screen.getByText('Deadline')).toBeVisible();
  });

  it('GIVEN errorText WHEN rendered THEN error message is visible', () => {
    render(<DatePicker errorText='This field is required' />);
    expect(screen.getByText('This field is required')).toBeVisible();
  });

  it('GIVEN closed popover WHEN trigger is clicked THEN calendar dialog opens', async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByRole('textbox'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('GIVEN calendar open WHEN a day is selected THEN onChange fires and popover closes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Wrapper initialValue={new Date(2026, 5, 1)} onChange={handleChange} />);
    await user.click(screen.getByRole('textbox'));
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: /Monday, June 15th, 2026/ }));
    expect(handleChange).toHaveBeenCalledTimes(1);
    const arg = handleChange.mock.calls[0][0] as Date;
    expect(arg).toBeInstanceOf(Date);
    expect(arg.getDate()).toBe(15);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('GIVEN calendar open WHEN Escape is pressed THEN popover closes without firing onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Wrapper onChange={handleChange} />);
    await user.click(screen.getByRole('textbox'));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('GIVEN calendar open WHEN Escape is pressed THEN the event does not propagate to outer listeners', async () => {
    const user = userEvent.setup();
    const outerEscape = vi.fn();
    // Register a document-level capture listener representing an outer modal (e.g. Radix Dialog's
    // DismissableLayer) so we can verify the DatePicker stops Escape before it reaches the modal.
    document.addEventListener('keydown', outerEscape, true);
    try {
      render(<Wrapper />);
      await user.click(screen.getByRole('textbox'));
      await screen.findByRole('dialog');
      outerEscape.mockClear();
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      const escapeEvents = outerEscape.mock.calls
        .map((c) => c[0] as KeyboardEvent)
        .filter((e) => e.key === 'Escape');
      expect(escapeEvents).toHaveLength(0);
    } finally {
      document.removeEventListener('keydown', outerEscape, true);
    }
  });

  it('GIVEN disabled WHEN trigger clicked THEN popover does NOT open', async () => {
    const user = userEvent.setup();
    render(<DatePicker disabled label='Deadline' />);
    await user.click(screen.getByRole('textbox'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('GIVEN calendar open WHEN trigger clicked again THEN popover toggles closed', async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    const trigger = screen.getByRole('textbox');
    await user.click(trigger);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('GIVEN disabledDates WHEN a disabled day is clicked THEN onChange is NOT called', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const initial = new Date(2026, 5, 15);
    render(
      <Wrapper
        initialValue={initial}
        onChange={handleChange}
        disabledDates={{ after: new Date(2026, 5, 10) }}
      />,
    );
    await user.click(screen.getByRole('textbox'));
    await screen.findByRole('dialog');
    const day20 = screen.getByRole('button', { name: /Saturday, June 20th, 2026/ });
    await user.click(day20);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
