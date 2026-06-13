import type { Meta, StoryObj } from '@storybook/react-vite';

import { Layout } from '.';

const meta = {
  title: 'Design System/Layout',
  component: Layout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onNewGoal: { action: 'onNewGoal' },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className='p-6 text-neutral-300 text-preset-5'>Page content goes here</div>,
  },
};
