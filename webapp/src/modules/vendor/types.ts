import * as decentraland from './decentraland'
import * as superRare from './super_rare'
import * as makersPlace from './makers_place'

// TODO: Rename to Vendor
export enum Vendors {
  DECENTRALAND = 'decentraland',
  SUPER_RARE = 'super_rare',
  MAKERS_PLACE = 'makers_place'
}

export const Disabled = {
  MAKERS_PLACE: Vendors.MAKERS_PLACE
}

export type ContractName =
  | decentraland.ContractName
  | superRare.ContractName
  | makersPlace.ContractName

export enum TransferType {
  SAFE_TRANSFER_FROM = 0,
  TRANSFER_FROM = 1,
  TRANSFER = 2
}
