import { Network } from '@dcl/schemas/dist/dapps/network'
import { BarChartProps } from 'decentraland-ui/lib/components/BarChart/BarChart.types'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  isMana: boolean
  min: string
  minLabel?: string
  max: string
  maxLabel?: string
  network?: Network
  errorMessage?: string
  upperBound?: number
  values?: BrowseOptions
  defaultCollapsed?: boolean
  onChange: (value: [string, string]) => void
  fetcher: () => Promise<Record<string, number>>
} & BarChartProps
