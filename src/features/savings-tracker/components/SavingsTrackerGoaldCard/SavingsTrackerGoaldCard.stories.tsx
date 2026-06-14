import type { Meta, StoryObj } from '@storybook/react-vite';
import { SavingsTrackerGoalCard } from '.';

const meta = {
  title: 'Components/SavingsTrackerGoalCard',
  component: SavingsTrackerGoalCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101010' }],
    },
  },
  args: {
    goalName: 'MacBook Pro M4',
    targetAmount: 2499,
    currentAmount: 1249,
    deadline: new Date(2026, 5, 1).getTime(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'wide', 'tall'],
    },
    state: {
      control: 'select',
      options: ['inProgress', 'complete', 'noProgress'],
    },
    goalName: { control: 'text' },
    targetAmount: { control: 'number' },
    currentAmount: { control: 'number' },
    deadline: { control: 'date' },
  },
} satisfies Meta<typeof SavingsTrackerGoalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DefaultInProgress: Story = {
  args: {
    size: 'default',
    state: 'inProgress',
  },
};

export const DefaultComplete: Story = {
  args: {
    size: 'default',
    state: 'complete',
    currentAmount: 2499,
  },
};

export const DefaultNoProgress: Story = {
  args: {
    size: 'default',
    state: 'noProgress',
    currentAmount: 0,
  },
};

export const WideInProgress: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    size: 'wide',
    state: 'inProgress',
  },
};

export const TallComplete: Story = {
  args: {
    size: 'tall',
    state: 'complete',
    currentAmount: 2499,
  },
};

export const TallInProgress: Story = {
  args: {
    size: 'tall',
    state: 'inProgress',
  },
};

export const AllVariants: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap gap-6'>
        <SavingsTrackerGoalCard {...args} size='default' state='inProgress' />
        <SavingsTrackerGoalCard {...args} size='default' state='complete' currentAmount={2499} />
        <SavingsTrackerGoalCard {...args} size='default' state='noProgress' currentAmount={0} />
      </div>
      <SavingsTrackerGoalCard {...args} size='wide' state='inProgress' />
      <div className='flex flex-wrap gap-6'>
        <SavingsTrackerGoalCard {...args} size='tall' state='inProgress' />
        <SavingsTrackerGoalCard {...args} size='tall' state='complete' currentAmount={2499} />
      </div>
    </div>
  ),
};
