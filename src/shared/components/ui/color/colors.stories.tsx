import type { Meta, StoryObj } from '@storybook/react-vite'

interface ColorSwatch {
  name: string
  hex: string
  rgb: string
  hsl: string
  className: string
  border?: boolean
}

interface ColorGroup {
  label: string
  swatches: ColorSwatch[]
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    label: 'Neutral',
    swatches: [
      { name: 'Neutral 900', hex: '#101010', rgb: '16, 16, 16',     hsl: "0°, 0%, 6%",     className: 'bg-neutral-900' },
      { name: 'Neutral 800', hex: '#1F1F1F', rgb: '31, 31, 31',     hsl: "0°, 0%, 12%",    className: 'bg-neutral-800' },
      { name: 'Neutral 700', hex: '#313131', rgb: '49, 49, 49',     hsl: "0°, 0%, 19%",    className: 'bg-neutral-700' },
      { name: 'Neutral 600', hex: '#3C3B40', rgb: '60, 59, 64',     hsl: "255°, 4%, 24%",  className: 'bg-neutral-600' },
      { name: 'Neutral 500', hex: '#676767', rgb: '103, 103, 103',  hsl: "0°, 0%, 40%",    className: 'bg-neutral-500' },
      { name: 'Neutral 400', hex: '#898A8B', rgb: '137, 138, 139',  hsl: "210°, 1%, 54%",  className: 'bg-neutral-400' },
      { name: 'Neutral 300', hex: '#B7B7B7', rgb: '183, 183, 183',  hsl: "168°, 21%, 93%", className: 'bg-neutral-300' },
      { name: 'Neutral 0',   hex: '#FFFFFF', rgb: '255, 255, 255',  hsl: "0, 0%, 100%",    className: 'bg-neutral-0', border: true },
    ],
  },
  {
    label: 'Orange',
    swatches: [
      { name: 'Orange 400', hex: '#FF5722', rgb: '255, 87, 34',  hsl: "14°, 100%, 57%", className: 'bg-orange-400' },
      { name: 'Orange 500', hex: '#EB430E', rgb: '235, 67, 14',  hsl: "15°, 89%, 49%",  className: 'bg-orange-500' },
      { name: 'Orange 700', hex: '#B92B09', rgb: '185, 43, 9',   hsl: "13°, 91%, 38%",  className: 'bg-orange-700' },
      { name: 'Orange 800', hex: '#903014', rgb: '144, 48, 20',  hsl: "15°, 76%, 32%",  className: 'bg-orange-800' },
    ],
  },
  {
    label: 'Green',
    swatches: [
      { name: 'Green 500', hex: '#4ADE80', rgb: '74, 222, 128', hsl: "142°, 69%, 58%", className: 'bg-green-500' },
      { name: 'Green 900', hex: '#1A3D2B', rgb: '26, 61, 43',   hsl: "148°, 40%, 17%", className: 'bg-green-900' },
    ],
  },
  {
    label: 'Red',
    swatches: [
      { name: 'Red 500', hex: '#EF4444', rgb: '239, 68, 68', hsl: "0°, 83%, 60%", className: 'bg-red-500' },
    ],
  },
]

function ColorPalette() {
  return (
    <div className="flex flex-col gap-12 p-10 bg-white min-h-screen">
      {COLOR_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <p className="font-bold text-2xl leading-tight text-neutral-900">{group.label}</p>
            <hr className="border-t border-neutral-900 opacity-15" />
          </div>
          <div className="flex flex-wrap gap-8">
            {group.swatches.map((swatch) => (
              <div key={swatch.name} className="flex flex-col gap-3 w-[230px]">
                <div
                  className={`${swatch.className} h-24 rounded-xl w-full${swatch.border ? ' shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]' : ''}`}
                />
                <p className="font-semibold text-lg text-neutral-900 leading-normal">{swatch.name}</p>
                <div className="flex flex-col gap-1 text-base leading-relaxed">
                  <div className="flex gap-8">
                    <span className="text-neutral-400 w-11">HEX</span>
                    <span className="text-neutral-900">{swatch.hex}</span>
                  </div>
                  <div className="flex gap-8">
                    <span className="text-neutral-400 w-11">RGB</span>
                    <span className="text-neutral-900">{swatch.rgb}</span>
                  </div>
                  <div className="flex gap-8">
                    <span className="text-neutral-400 w-11">HSL</span>
                    <span className="text-neutral-900">{swatch.hsl}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Design System/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPalette>

export default meta
type Story = StoryObj<typeof meta>

export const AllColors: Story = {}
