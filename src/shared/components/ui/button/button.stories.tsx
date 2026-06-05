import type { IconName } from '@/shared/components/ui/icons/icon-map'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '.'

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
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101010' }],
    },
  },
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    leftIcon: {
      control: 'select',
      options: [undefined, ...iconOptions],
    },
    rightIcon: {
      control: 'select',
      options: [undefined, ...iconOptions],
    },
    disabled: {
      control: 'boolean',
    },
    asChild: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="primary">Button</Button>
      <Button variant="secondary">Button</Button>
      <Button variant="tertiary">Button</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3">
        <Button variant="primary" leftIcon="filter">Button</Button>
        <Button variant="primary">Button</Button>
        <Button variant="primary" rightIcon="arrow-down">Button</Button>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" leftIcon="filter">Button</Button>
        <Button variant="secondary">Button</Button>
        <Button variant="secondary" rightIcon="arrow-down">Button</Button>
      </div>
      <div className="flex gap-3">
        <Button variant="tertiary" leftIcon="filter">Button</Button>
        <Button variant="tertiary">Button</Button>
        <Button variant="tertiary" rightIcon="arrow-down">Button</Button>
      </div>
    </div>
   
  ),
}

export const AllDisabled: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="primary" disabled>Button</Button>
      <Button variant="secondary" disabled>Button</Button>
      <Button variant="tertiary" disabled>Button</Button>
    </div>
  ),
}

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <Button variant="primary" className="w-full">Login</Button>
  ),
}





