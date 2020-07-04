import { VendorFactory } from '../vendor/VendorFactory'
import { ContractService } from '../vendor/services'
import { ContractName, Vendors } from '../vendor/types'

export let contractAddresses: ContractService['contractAddresses']
export let contractSymbols: ContractService['contractSymbols']
export let contractNames: ContractService['contractNames']
export let contractCategories: ContractService['contractCategories']
export let contractVendors: Record<string, Vendors>

export function buildContracts() {
  const vendors = Object.values(Vendors).map(VendorFactory.build)

  contractAddresses = vendors.reduce(
    (obj, { contractService }) => ({
      ...obj,
      ...contractService.contractAddresses
    }),
    {} as ContractService['contractAddresses']
  ) as Record<ContractName, string>

  contractSymbols = vendors.reduce(
    (obj, { contractService }) => ({
      ...obj,
      ...contractService.contractSymbols
    }),
    {} as ContractService['contractSymbols']
  )

  contractNames = vendors.reduce(
    (obj, { contractService }) => ({
      ...obj,
      ...contractService.contractNames
    }),
    {} as ContractService['contractNames']
  )

  contractCategories = vendors.reduce(
    (obj, { contractService }) => ({
      ...obj,
      ...contractService.contractCategories
    }),
    {} as ContractService['contractCategories']
  )

  contractVendors = {}
  for (const { type, contractService } of vendors) {
    Object.values(contractService.contractAddresses).reduce((obj, address) => {
      obj[address] = type
      return obj
    }, contractVendors)
  }
}
