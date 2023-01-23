import { Network } from '@dcl/schemas'

export type PriceChartProps = {
  height?: number | string
  width?: number | string
  sliderStep?: number
  prices?: Record<number, number>
  upperBound?: number
  loading?: boolean
  minPrice: string
  maxPrice: string
  network?: Network
  errorMessage?: string
  onChange: (value: [string, string]) => void
}
