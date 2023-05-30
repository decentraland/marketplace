import { Network, NFTCategory } from '@dcl/schemas'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib/eth'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { NFT } from '../nft/types'
import { VendorName } from '../vendor'
import { Contract } from '../vendor/services'

export function upsertContracts(
  storedContracts: Contract[],
  newContracts: Contract[]
) {
  const contractsByAddressAndChain = storedContracts.reduce(
    (map, contract) => map.set(getContractKey(contract), { ...contract }),
    new Map<string, Contract>()
  )

  newContracts.forEach(contract => {
    contractsByAddressAndChain.set(getContractKey(contract), {
      ...contract,
      address: contract.address.toLowerCase()
    })
  })

  return Array.from(contractsByAddressAndChain.values())
}

export function getContractKey(contract: Contract) {
  return `${contract.address.toLowerCase()}-${contract.chainId}`
}

export function getContractKeyFromNFT(nft: NFT) {
  return `${nft.contractAddress.toLowerCase()}-${nft.chainId}`
}

export function getAuthorizationKey({
  address,
  authorizedAddress,
  contractAddress,
  chainId
}: Authorization) {
  return `${address}-${authorizedAddress}-${contractAddress}-${chainId}`
}

export const STUB_MATIC_COLLECTION_CONTRACT_NAME =
  'Stub Matic Collection Contract Name'

export function getStubMaticCollectionContract(address: string) {
  return {
    address: address.toLowerCase(),
    category: NFTCategory.WEARABLE,
    chainId: getChainIdByNetwork(Network.MATIC),
    network: Network.MATIC,
    vendor: VendorName.DECENTRALAND,
    name: STUB_MATIC_COLLECTION_CONTRACT_NAME
  }
}

export function isStubMaticCollectionContract(contract: Contract) {
  return (
    contract.name === STUB_MATIC_COLLECTION_CONTRACT_NAME &&
    contract.network === Network.MATIC
  )
}

export function getContractByParams(contracts: Contract[], query: Partial<Contract>) {
  const found = contracts.find(contract =>
    Object.keys(query).every(
      key =>
        query[key as keyof Contract]?.toString().toLowerCase() ===
        contract[key as keyof Contract]?.toString().toLowerCase()
    )
  )

  return found || null
}
