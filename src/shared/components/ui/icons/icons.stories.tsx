import type { Meta, StoryObj } from '@storybook/react-vite'

import { Icon } from './icon'
import { ICON_MAP, type IconName } from './icon-map'

const ICON_NAMES = Object.keys(ICON_MAP) as IconName[]

function IconGallery() {
  return (
    <div className='bg-neutral-300' style={{ padding: '40px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        {ICON_NAMES.map((name) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 ">
            <Icon name={name} />
            <span
              className="text-xs text-gray-500 font-inter whitespace-nowrap">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: 'Design System/Icons',
  component: IconGallery,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconGallery>

export default meta
type Story = StoryObj<typeof meta>

export const AllIcons: Story = {}
