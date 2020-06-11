import { VendorFactory } from '../vendor/VendorFactory'
import { ContractService } from '../vendor/services'
import { ContractName, Vendors } from '../vendor/types'

const vendors = Object.values(Vendors).map(VendorFactory.build)

export const contractAddresses = vendors.reduce(
  (obj, { contractService }) => ({
    ...obj,
    ...contractService.contractAddresses
  }),
  {} as ContractService['contractAddresses']
) as Record<ContractName, string>

export const contractSymbols = vendors.reduce(
  (obj, { contractService }) => ({
    ...obj,
    ...contractService.contractSymbols
  }),
  {} as ContractService['contractSymbols']
)

export const contractNames = vendors.reduce(
  (obj, { contractService }) => ({
    ...obj,
    ...contractService.contractNames
  }),
  {} as ContractService['contractNames']
)

export const contractCategories = vendors.reduce(
  (obj, { contractService }) => ({
    ...obj,
    ...contractService.contractCategories
  }),
  {} as ContractService['contractCategories']
)

export const contractVendors: Record<string, Vendors> = {}
for (const { type, contractService } of vendors) {
  Object.values(contractService.contractAddresses).reduce(
    (obj, address) => ({
      ...obj,
      [address]: type
    }),
    contractVendors
  )
}
