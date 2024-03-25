import { BarChartProps } from 'decentraland-ui/lib/components/BarChart/BarChart.types'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  isMana: boolean
  values?: BrowseOptions
  defaultCollapsed?: boolean
  fetcher: () => Promise<Record<string, number>>
} & Omit<BarChartProps, 'isMana'>
