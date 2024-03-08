import { VendorName } from '../types'

import * as decentraland from '../decentraland'

export type NFTsFetchFilters<V extends VendorName | unknown = unknown> = V extends VendorName.DECENTRALAND
  ? decentraland.NFTsFetchFilters
  : V extends unknown
    ? decentraland.NFTsFetchFilters
    : never
