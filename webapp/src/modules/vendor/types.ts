import * as decentraland from './decentraland'
import * as superRare from './super_rare'

export enum Partner {
  SUPER_RARE = 'super_rare'
}

enum Base {
  DECENTRALAND = 'decentraland'
}

export type Vendors = Partner | Base
export const Vendors = { ...Partner, ...Base }

export type ContractName = decentraland.ContractName | superRare.ContractName

export enum TransferType {
  SAFE_TRANSFER_FROM = 0,
  TRANSFER_FROM = 1,
  TRANSFER = 2
}
