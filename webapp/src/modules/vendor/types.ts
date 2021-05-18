import * as decentraland from './decentraland'
import * as superRare from './super_rare'
import * as makersPlace from './makers_place'
import * as knownOrigin from './known_origin'

export enum VendorName {
  DECENTRALAND = 'decentraland',
  SUPER_RARE = 'super_rare',
  MAKERS_PLACE = 'makers_place',
  KNOWN_ORIGIN = 'known_origin'
}

export const Disabled = {}

const ContractName = {
  ...decentraland.ContractName,
  ...superRare.ContractName,
  ...makersPlace.ContractName,
  ...knownOrigin.ContractName
}

export type ContractName = typeof ContractName

export const getContractNames = () =>
  ({
    ...decentraland.ContractName,
    ...superRare.ContractName,
    ...makersPlace.ContractName,
    ...knownOrigin.ContractName
  } as ContractName)

export enum TransferType {
  SAFE_TRANSFER_FROM = 0,
  TRANSFER_FROM = 1,
  TRANSFER = 2
}
