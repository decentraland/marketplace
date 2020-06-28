import * as decentraland from './decentraland'
import * as superRare from './super_rare'

export enum Vendors {
  DECENTRALAND = 'decentraland',
  SUPER_RARE = 'super_rare'
}

export type ContractName =
  | keyof typeof decentraland.ContractService['contractAddresses']
  | keyof typeof superRare.ContractService['contractAddresses']

export type NFTsFetchFilters =
  | decentraland.NFTsFetchFilters
  | superRare.NFTsFetchFilters
