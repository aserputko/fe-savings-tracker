import { Button } from '@/shared/components/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dialog } from '.';

const meta = {
  title: 'Design System/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101010' }],
    },
  },
  args: {
    title: 'New goal',
    open: true,
    children: undefined,
    footer: undefined,
  },
  argTypes: {
    title: {
      control: 'text',
    },
    open: {
      control: 'boolean',
    },
    onOpenChange: {
      table: { disable: true },
    },
    children: {
      table: { disable: true },
    },
    footer: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(args.open ?? true);
    return (
      <>
        <Button variant='primary' onClick={() => setOpen(true)}>
          Open Dialog
        </Button>
        <Dialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};

export const Empty: Story = {
  render: () => <Dialog title='New goal' open />,
};

export const WithContent: Story = {
  render: () => (
    <Dialog title='New goal' open>
      <p className='text-neutral-300 text-base leading-normal tracking-[-0.3px]'>
        Set a savings goal to start tracking your progress. Give your goal a name, define a target
        amount, and optionally set a deadline.
      </p>
    </Dialog>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Dialog
      title='New goal'
      open
      footer={
        <>
          <Button variant='secondary'>Cancel</Button>
          <Button variant='primary'>Create goal</Button>
        </>
      }
    />
  ),
};

export const WithContentAndFooter: Story = {
  render: () => (
    <Dialog
      title='New goal'
      open
      footer={
        <>
          <Button variant='secondary'>Cancel</Button>
          <Button variant='primary'>Create goal</Button>
        </>
      }
    >
      <p className='text-neutral-300 text-base leading-normal tracking-[-0.3px]'>
        Set a savings goal to start tracking your progress. Give your goal a name, define a target
        amount, and optionally set a deadline.
      </p>
    </Dialog>
  ),
};
