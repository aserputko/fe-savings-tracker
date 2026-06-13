import type { Meta, StoryObj } from '@storybook/react-vite';

import { Navbar } from '.';

const meta = {
  title: 'Design System/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onNewGoal: { action: 'onNewGoal' },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
