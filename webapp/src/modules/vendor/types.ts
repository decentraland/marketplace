import { RentalStatus } from '@dcl/schemas'
import * as decentraland from './decentraland'

export enum VendorName {
  DECENTRALAND = 'decentraland'
}

export const Disabled = {}

const ContractName = {
  ...decentraland.ContractName
}

// eslint-disable-next-line @typescript-eslint/no-redeclare -- Intentionally naming the variable the same as the type
export type ContractName = typeof ContractName

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
