import type { Meta, StoryObj } from '@storybook/react-vite';

import { SavingsTrackerNavbar } from '.';

const meta = {
  title: 'Components/SavingsTrackerNavbar',
  component: SavingsTrackerNavbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onNewGoal: { action: 'onNewGoal' },
  },
} satisfies Meta<typeof SavingsTrackerNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
