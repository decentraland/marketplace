import { Network } from '@dcl/schemas/dist/dapps/network'
import { BrowseOptions } from '../../../modules/routing/types'
import { LANDFilters } from '../../Vendor/decentraland/types'

export type Props = {
  landStatus: LANDFilters
  minPrice: string
  maxPrice: string
  network?: Network
  values?: BrowseOptions
  onChange: (value: [string, string]) => void
  defaultCollapsed?: boolean
}

export type OwnProps = Props
