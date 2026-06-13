import type { Meta, StoryObj } from '@storybook/react-vite'

interface TypographyPreset {
  name: string
  label: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
  className: string
}

const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    name: 'Text Preset 1',
    label: 'Bricolage Grotesque, SemiBold',
    fontSize: '64 px',
    lineHeight: '100%',
    letterSpacing: '-2px',
    className: 'text-preset-1',
  },
  {
    name: 'Text Preset 1 (Mobile)',
    label: 'Bricolage Grotesque, SemiBold',
    fontSize: '44 px',
    lineHeight: '100%',
    letterSpacing: '-2px',
    className: 'text-preset-1-mobile',
  },
  {
    name: 'Text Preset 2',
    label: 'Inter, Bold',
    fontSize: '32 px',
    lineHeight: '120%',
    letterSpacing: '0px',
    className: 'text-preset-2',
  },
  {
    name: 'Text Preset 3',
    label: 'Inter, Bold',
    fontSize: '20 px',
    lineHeight: '120%',
    letterSpacing: '-0.3px',
    className: 'text-preset-3',
  },
  {
    name: 'Text Preset 4',
    label: 'Inter, SemiBold',
    fontSize: '20 px',
    lineHeight: '120%',
    letterSpacing: '-0.3px',
    className: 'text-preset-4',
  },
  {
    name: 'Text Preset 5',
    label: 'Inter, Medium',
    fontSize: '16 px',
    lineHeight: '150%',
    letterSpacing: '-0.3px',
    className: 'text-preset-5',
  },
  {
    name: 'Text Preset 5 (SemiBold)',
    label: 'Inter, SemiBold',
    fontSize: '16 px',
    lineHeight: '140%',
    letterSpacing: '-0.3px',
    className: 'text-preset-5-semi-bold',
  },
  {
    name: 'Text Preset 6',
    label: 'Inter, SemiBold',
    fontSize: '14 px',
    lineHeight: '140%',
    letterSpacing: '-0.3px',
    className: 'text-preset-6',
  },
  {
    name: 'Text Preset 7',
    label: 'Inter, SemiBold',
    fontSize: '11 px',
    lineHeight: '120%',
    letterSpacing: '0px',
    className: 'text-preset-7',
  },
]

function MetaBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#cacfd8] rounded-lg flex gap-2 items-center px-4 py-1 text-base text-neutral-900 whitespace-nowrap">
      <span className="opacity-70">{label}:</span>
      <span>{value}</span>
    </div>
  )
}

function TypographyShowcase() {
  return (
    <div className="flex flex-col gap-12.5 items-start p-20 bg-white min-h-screen">
      {TYPOGRAPHY_PRESETS.map((preset) => (
        <div key={preset.name} className="flex flex-col gap-6 w-full">
          <div className="flex gap-4 items-start text-base font-medium text-neutral-900">
            <span className="whitespace-nowrap">{preset.name}</span>
            <span>-</span>
            <span>{preset.label}</span>
          </div>

          <p className={`${preset.className} text-neutral-900 w-full [word-break:break-word]`}>
            The quick brown fox jumps over the lazy dog.
          </p>

          <div className="flex gap-4 flex-wrap text-neutral-900">
            <MetaBadge label="Font Size" value={preset.fontSize} />
            <MetaBadge label="Line Height" value={preset.lineHeight} />
            <MetaBadge label="Letter Spacing" value={preset.letterSpacing} />
          </div>

          <div className="h-px bg-[#e0e4ea] w-full" />
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Design System/Typography',
  component: TypographyShowcase,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const AllPresets: Story = {}
