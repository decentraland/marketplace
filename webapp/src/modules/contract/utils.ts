import { NFTCategory } from '../nft/types'
import { VendorFactory } from '../vendor/VendorFactory'
import { Vendors } from '../vendor/types'

export let contractAddresses: Record<string, string> = {}
export let contractSymbols: Record<string, string> = {}
export let contractNames: Record<string, string> = {}
export let contractCategories: Record<string, NFTCategory> = {}
export let contractVendors: Record<string, Vendors> = {}

export async function buildContracts() {
  const vendors = Object.values(Vendors).map(VendorFactory.build)

  for (const vendor of vendors) {
    const { type, contractService } = vendor

    contractAddresses = {
      ...contractAddresses,
      ...(await contractService.getContractAddresses())
    }

    contractSymbols = {
      ...contractSymbols,
      ...(await contractService.getContractSymbols())
    }

    contractNames = {
      ...contractNames,
      ...(await contractService.getContractNames())
    }

    contractCategories = {
      ...contractCategories,
      ...(await contractService.getContractCategories())
    }

    const addresses: string[] = Object.values(
      await contractService.getContractAddresses()
    )
    for (const address of addresses) {
      contractVendors[address] = type as Vendors
    }
  }
}
