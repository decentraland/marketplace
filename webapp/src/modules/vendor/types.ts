import * as decentraland from './decentraland'
import * as superRare from './super_rare'

export enum Partners {
  SUPER_RARE = 'super_rare'
}

enum Base {
  DECENTRALAND = 'decentraland'
}

export type Vendors = Partners | Base
export const Vendors = { ...Partners, ...Base }

export type ContractName = decentraland.ContractName | superRare.ContractName

export type NFTsFetchFilters =
  | decentraland.NFTsFetchFilters
  | superRare.NFTsFetchFilters
