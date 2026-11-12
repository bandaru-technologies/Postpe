import * as Slider from '@radix-ui/react-slider'
import { formatPrice } from '../lib/utils'

interface PriceFilterProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export default function PriceFilter({ min, max, value, onChange }: PriceFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Price Range</span>
        <span className="text-accent font-medium text-xs">
          {formatPrice(value[0])} – {value[1] >= max ? 'Any' : formatPrice(value[1])}
        </span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={min}
        max={max}
        step={500}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
      >
        <Slider.Track className="bg-navy-700 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-accent rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-accent rounded-full shadow-glow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-accent/40"
          aria-label="Minimum price"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-accent rounded-full shadow-glow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-accent/40"
          aria-label="Maximum price"
        />
      </Slider.Root>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}+</span>
      </div>
    </div>
  )
}
