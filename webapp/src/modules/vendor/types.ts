import * as decentraland from './decentraland'
import * as superRare from './super_rare'

export enum Partners {
  SUPER_RARE = 'super_rare'
}

enum Main {
  DECENTRALAND = 'decentraland'
}

export type Vendors = Partners | Main
export const Vendors = { ...Partners, ...Main }

export type ContractName = decentraland.ContractName | superRare.ContractName

export type NFTsFetchFilters =
  | decentraland.NFTsFetchFilters
  | superRare.NFTsFetchFilters
