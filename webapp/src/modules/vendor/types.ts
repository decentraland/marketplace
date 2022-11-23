import { RentalStatus } from '@dcl/schemas'
import * as decentraland from './decentraland'

export enum VendorName {
  DECENTRALAND = 'decentraland'
}

export const Disabled = {}

export const getContractNames = () => ({
  ...decentraland.ContractName
})

export enum TransferType {
  SAFE_TRANSFER_FROM = 0,
  TRANSFER_FROM = 1,
  TRANSFER = 2
}

export type FetchOneOptions = {
  rentalStatus?: RentalStatus[]
}
