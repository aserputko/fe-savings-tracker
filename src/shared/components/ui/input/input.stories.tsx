import type { IconName } from '@/shared/components/ui/icons/icon-map'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '.'

const iconOptions: IconName[] = [
  'arrow-down',
  'calendar',
  'checkmark',
  'chevron-left',
  'cross',
  'dollar',
  'error',
  'filter',
  'plus',
  'sort',
]

const meta = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101010' }],
    },
  },
  args: {
    placeholder: 'Placeholder',
    variant: 'default',
    label: undefined,
    leftIcon: undefined,
    errorText: undefined,
    disabled: false,
    required: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
    },
    leftIcon: {
      control: 'select',
      options: [undefined, ...iconOptions],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    errorText: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    className: 'w-90',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-90">
      <Input
        label="Default"
        placeholder="Placeholder"
        variant="default"
      />
      <Input
        label="Error"
        placeholder="Placeholder"
        variant="error"
        errorText="Error text here"
      />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-90">
      <Input
        label="Label"
        placeholder="Placeholder"
      />
      <Input
        label="Required field"
        placeholder="Placeholder"
        required
      />
      <Input
        placeholder="No label"
      />
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-90">
      <Input
        label="Amount"
        placeholder="e.g. 2000"
        leftIcon="dollar"
      />
      <Input
        label="Due Date"
        placeholder="Pick a date"
        leftIcon="calendar"
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-90">
      <Input
        label="Amount"
        placeholder="e.g. 2000"
        leftIcon="dollar"
        variant="error"
        errorText="Amount is required"
      />
      <Input
        label="Goal Name"
        placeholder="e.g. New car"
        variant="error"
        errorText="This field cannot be empty"
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-90">
      <Input
        label="Label"
        placeholder="Placeholder"
        disabled
      />
      <Input
        label="With Icon"
        placeholder="Placeholder"
        leftIcon="dollar"
        disabled
      />
    </div>
  ),
}

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <Input
      label="Amount"
      placeholder="e.g. 2000"
      leftIcon="dollar"
    />
  ),
}
