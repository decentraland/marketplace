import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { ContractName, getContract } from 'decentraland-transactions'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'

/* This helper had to be moved to a separate file so it can be mocked independently on tests */

export async function getRentalsContractInstance(chainId: ChainId) {
  const provider = await getConnectedProvider()
  if (!provider) {
    throw new Error('Could not get connected provider')
  }
  const { address, abi } = getContract(ContractName.Rentals, chainId)
  const instance = new ethers.Contract(
    address,
    abi,
    new ethers.providers.Web3Provider(provider)
  )
  return instance
}
