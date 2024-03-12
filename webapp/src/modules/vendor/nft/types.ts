import { VendorName } from '../types'

import * as decentraland from '../decentraland'

export type NFTsFetchFilters<V = unknown> = V extends VendorName.DECENTRALAND
  ? decentraland.NFTsFetchFilters
  : V extends unknown
    ? decentraland.NFTsFetchFilters
    : never
