import * as decentraland from './decentraland'
import * as superRare from './super_rare'
import * as makersPlace from './makers_place'

export enum Partner {
  SUPER_RARE = 'super_rare'
}

enum Disabled {
  MAKERS_PLACE = 'makers_place'
}

enum Base {
  DECENTRALAND = 'decentraland'
}

export type Vendors = Partner | Base | Disabled
export const Vendors = { ...Partner, ...Base, ...Disabled }

export type ContractName =
  | decentraland.ContractName
  | superRare.ContractName
  | makersPlace.ContractName

export enum TransferType {
  SAFE_TRANSFER_FROM = 0,
  TRANSFER_FROM = 1,
  TRANSFER = 2
}
