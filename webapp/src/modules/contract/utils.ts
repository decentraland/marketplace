import { VendorFactory } from '../vendor/VendorFactory'
import { VendorName } from '../vendor/types'
import { Contract } from '../vendor/services'

export let contracts: Contract[] = []

export async function buildContracts() {
  const vendors = Object.values(VendorName).map(VendorFactory.build)

  for (const vendor of vendors) {
    const { contractService } = vendor

    await contractService.build()

    contracts = [...contracts, ...contractService.getContracts()]
  }
}

export function getContract(query: Partial<Contract>): Contract {
  const found = contracts.find(contract =>
    Object.keys(query).every(
      key =>
        query[key as keyof Contract]?.toString().toLowerCase() ===
        contract[key as keyof Contract]?.toString().toLowerCase()
    )
  )
  if (!found) {
    throw new Error(`Contract not found, query=${JSON.stringify(query)}`)
  }
  return found
}
