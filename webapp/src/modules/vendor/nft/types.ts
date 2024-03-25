import * as decentraland from '../decentraland'
import { VendorName } from '../types'

export type NFTsFetchFilters<V = unknown> = V extends VendorName.DECENTRALAND
  ? decentraland.NFTsFetchFilters
  : V extends unknown
    ? decentraland.NFTsFetchFilters
    : never
