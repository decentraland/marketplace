import { RentalStatus } from '@dcl/schemas'
import { ContractName as DecentralandContractName } from './decentraland/contracts'

export enum VendorName {
  DECENTRALAND = 'decentraland'
}

export const Disabled = {}

const ContractName = {
  ...DecentralandContractName
}

// eslint-disable-next-line @typescript-eslint/no-redeclare -- Intentionally naming the variable the same as the type
export type ContractName = typeof ContractName

export const getContractNames = () => ({
  ...DecentralandContractName
})

export enum TransferType {
  SAFE_TRANSFER_FROM = 0,
  TRANSFER_FROM = 1,
  TRANSFER = 2
}

export type FetchOneOptions = {
  rentalStatus?: RentalStatus[]
}
