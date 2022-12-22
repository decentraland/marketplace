import { Network, NFTCategory } from '@dcl/schemas'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib/eth'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { race, select, take } from 'redux-saga/effects'
import { NFT } from '../nft/types'
import { VendorName } from '../vendor'
import { Contract } from '../vendor/services'
import {
  FetchContractsFailureAction,
  FetchContractsSuccessAction,
  FETCH_CONTRACTS_FAILURE,
  FETCH_CONTRACTS_REQUEST,
  FETCH_CONTRACTS_SUCCESS
} from './actions'
import { getContracts, getLoading } from './selectors'

export function* getOrWaitForContracts() {
  const loading: LoadingState = yield select(getLoading)

  if (isLoadingType(loading, FETCH_CONTRACTS_REQUEST)) {
    const result: {
      success: FetchContractsSuccessAction
      failure: FetchContractsFailureAction
    } = yield race({
      success: take(FETCH_CONTRACTS_SUCCESS),
      failure: take(FETCH_CONTRACTS_FAILURE)
    })
    if (result.failure) {
      throw new Error(`Could not load contracts`)
    }
  }
  const contracts: ReturnType<typeof getContracts> = yield select(getContracts)
  return contracts
}

export function upsertContracts(
  storedContracts: Contract[],
  newContracts: Contract[]
) {
  const contractsByAddressAndChain = storedContracts.reduce(
    (map, contract) =>
      map.set(getAddressAndChainIdFromContract(contract), { ...contract }),
    new Map<string, Contract>()
  )

  newContracts.forEach(contract => {
    contractsByAddressAndChain.set(getAddressAndChainIdFromContract(contract), {
      ...contract,
      address: contract.address.toLowerCase()
    })
  })

  return Array.from(contractsByAddressAndChain.values())
}

export function getAddressAndChainIdFromContract(contract: Contract) {
  return `${contract.address.toLowerCase()}-${contract.chainId}`
}

export function getAddressAndChainIdFromNFT(nft: NFT) {
  return `${nft.contractAddress.toLowerCase()}-${nft.chainId}`
}

export function getAddressAuthorizedAddressAndContractAddress(
  authorization: Authorization
) {
  return `${authorization.address}-${authorization.authorizedAddress}-${authorization.contractAddress}`
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
