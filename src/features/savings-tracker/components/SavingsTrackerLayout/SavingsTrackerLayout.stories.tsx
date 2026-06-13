import type { Meta, StoryObj } from '@storybook/react-vite';

import { SavingsTrackerLayout } from '.';

const meta = {
  title: 'Components/SavingsTrackerLayout',
  component: SavingsTrackerLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {},
} satisfies Meta<typeof SavingsTrackerLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className='p-6 text-neutral-300 text-preset-5'>Page content goes here</div>,
  },
};
