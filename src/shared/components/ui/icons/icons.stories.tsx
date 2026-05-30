import type { Meta, StoryObj } from '@storybook/react-vite'

import arrowDown from '@/assets/images/icon-arrow-down.svg'
import calendar from '@/assets/images/icon-calendar.svg'
import checkmark from '@/assets/images/icon-checkmark.svg'
import chevronLeft from '@/assets/images/icon-chevron-left.svg'
import cross from '@/assets/images/icon-cross.svg'
import dollar from '@/assets/images/icon-dollar.svg'
import error from '@/assets/images/icon-error.svg'
import filter from '@/assets/images/icon-filter.svg'
import plus from '@/assets/images/icon-plus.svg'
import sort from '@/assets/images/icon-sort.svg'

interface IconItem {
  name: string
  src: string
}

const ICONS: IconItem[] = [
  { name: 'arrow-down',   src: arrowDown },
  { name: 'calendar',     src: calendar },
  { name: 'checkmark',    src: checkmark },
  { name: 'chevron-left', src: chevronLeft },
  { name: 'cross',        src: cross },
  { name: 'dollar',       src: dollar },
  { name: 'error',        src: error },
  { name: 'filter',       src: filter },
  { name: 'plus',         src: plus },
  { name: 'sort',         src: sort },
]

function IconGallery() {
  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        {ICONS.map(({ name, src }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <img src={src} alt={name} width={20} height={20} style={{ filter: 'invert(1)' }} />
            <span
              style={{
                fontSize: '12px',
                color: '#898a8b',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
              }}
            >
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
