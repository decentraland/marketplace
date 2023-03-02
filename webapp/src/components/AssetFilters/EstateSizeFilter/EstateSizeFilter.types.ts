import { Network } from '@dcl/schemas/dist/dapps/network'
import { BrowseOptions } from '../../../modules/routing/types'
import { LANDFilters } from '../../Vendor/decentraland/types'

export type Props = {
  landStatus: LANDFilters
  min: string
  max: string
  minPrice?: string
  maxPrice?: string
  network?: Network
  values?: BrowseOptions
  onChange: (value: [string, string]) => void
  defaultCollapsed?: boolean
  minDistanceToPlaza?: string
  maxDistanceToPlaza?: string
  adjacentToRoad?: boolean
}

export type OwnProps = Props
