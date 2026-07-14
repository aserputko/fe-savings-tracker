import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePicker } from '.';

const meta = {
  title: 'Design System/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101010' }],
    },
  },
  args: {
    label: 'Deadline',
    placeholder: 'Select a date',
    variant: 'default',
    disabled: false,
    required: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    errorText: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className='w-90'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledDatePicker = (args: React.ComponentProps<typeof DatePicker>) => {
  const [value, setValue] = useState<Date | undefined>(args.value);
  return (
    <DatePicker
      {...args}
      value={value}
      onChange={(date) => {
        setValue(date);
        args.onChange?.(date);
      }}
    />
  );
};

export const Playground: Story = {
  render: (args) => <ControlledDatePicker {...args} />,
};

export const WithoutLabel: Story = {
  render: (args) => <ControlledDatePicker {...args} label={undefined} />,
};

export const WithPreselectedValue: Story = {
  args: {
    value: new Date(2026, 5, 15),
  },
  render: (args) => <ControlledDatePicker {...args} />,
};

export const WithError: Story = {
  args: {
    variant: 'error',
    errorText: 'Deadline must not be in the past',
  },
  render: (args) => <ControlledDatePicker {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: new Date(2026, 5, 15),
  },
  render: (args) => <ControlledDatePicker {...args} />,
};

export const WithDisabledPastDates: Story = {
  args: {
    disabledDates: { before: new Date() },
  },
  render: (args) => <ControlledDatePicker {...args} />,
};

export const Required: Story = {
  args: {
    required: true,
  },
  render: (args) => <ControlledDatePicker {...args} />,
};
