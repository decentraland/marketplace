import * as decentraland from './decentraland'
import * as superRare from './super_rare'

export enum Vendors {
  DECENTRALAND = 'decentraland',
  SUPER_RARE = 'super_rare',
  KNOWN_ORIGIN = 'known_origin',
  MAKERS_PLACE = 'makers_place'
}

export type ContractName =
  | keyof typeof decentraland.ContractService['contractAddresses']
  | keyof typeof superRare.ContractService['contractAddresses']

export type NFTsParams = decentraland.NFTsParams | superRare.NFTsParams
