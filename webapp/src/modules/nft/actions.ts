import { action } from 'typesafe-actions'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'

import { SortDirection } from '../routing/search'
import { Order } from '../order/types'
import { Account } from '../account/types'
import { View } from '../ui/types'
import { ContractName } from '../contract/types'
import {
  WearableCategory,
  WearableRarity,
  WearableGender
} from './wearable/types'
import { NFT, NFTCategory, NFTSortBy } from './types'
import { getNFTName } from './utils'

// Fetch NFTs

export const FETCH_NFTS_REQUEST = '[Request] Fetch NFTs'
export const FETCH_NFTS_SUCCESS = '[Success] Fetch NFTs'
export const FETCH_NFTS_FAILURE = '[Failure] Fetch NFTs'

export type FetchNFTsOptions = {
  variables: {
    first: number
    skip: number
    orderBy?: NFTSortBy
    orderDirection?: SortDirection
    address?: string
    onlyOnSale: boolean
    isLand?: boolean
    isWearableHead?: boolean
    isWearableAccessory?: boolean
    category?: NFTCategory
    wearableCategory?: WearableCategory
    wearableRarities?: WearableRarity[]
    wearableGenders?: WearableGender[]
    search?: string
    contracts?: ContractName[]
  }
  view?: View
}

export const DEFAULT_FETCH_NFTS_OPTIONS: FetchNFTsOptions = {
  variables: {
    first: 24,
    skip: 0,
    orderBy: NFTSortBy.CREATED_AT,
    orderDirection: SortDirection.DESC,
    onlyOnSale: false
  },
  view: undefined
}

export const fetchNFTsRequest = (options: Partial<FetchNFTsOptions> = {}) =>
  action(FETCH_NFTS_REQUEST, { options })
export const fetchNFTsSuccess = (
  options: FetchNFTsOptions,
  nfts: NFT[],
  accounts: Account[],
  orders: Order[],
  count: number
) => action(FETCH_NFTS_SUCCESS, { options, nfts, accounts, orders, count })
export const fetchNFTsFailure = (options: FetchNFTsOptions, error: string) =>
  action(FETCH_NFTS_FAILURE, { options, error })

export type FetchNFTsRequestAction = ReturnType<typeof fetchNFTsRequest>
export type FetchNFTsSuccessAction = ReturnType<typeof fetchNFTsSuccess>
export type FetchNFTsFailureAction = ReturnType<typeof fetchNFTsFailure>

// Fetch NFT

export const FETCH_NFT_REQUEST = '[Request] Fetch NFT'
export const FETCH_NFT_SUCCESS = '[Success] Fetch NFT'
export const FETCH_NFT_FAILURE = '[Failure] Fetch NFT'

export const fetchNFTRequest = (contractAddress: string, tokenId: string) =>
  action(FETCH_NFT_REQUEST, { contractAddress, tokenId })
export const fetchNFTSuccess = (nft: NFT, order: Order | null) =>
  action(FETCH_NFT_SUCCESS, { nft, order })
export const fetchNFTFailure = (
  contractAddress: string,
  tokenId: string,
  error: string
) => action(FETCH_NFT_FAILURE, { contractAddress, tokenId, error })

export type FetchNFTRequestAction = ReturnType<typeof fetchNFTRequest>
export type FetchNFTSuccessAction = ReturnType<typeof fetchNFTSuccess>
export type FetchNFTFailureAction = ReturnType<typeof fetchNFTFailure>

// Transfer NFT

export const TRANSFER_NFT_REQUEST = '[Request] Transfer NFT'
export const TRANSFER_NFT_SUCCESS = '[Success] Transfer NFT'
export const TRANSFER_NFT_FAILURE = '[Failure] Transfer NFT'

export const transferNFTRequest = (nft: NFT, address: string) =>
  action(TRANSFER_NFT_REQUEST, { nft, address })
export const transferNFTSuccess = (nft: NFT, address: string, txHash: string) =>
  action(TRANSFER_NFT_SUCCESS, {
    nft,
    address,
    ...buildTransactionPayload(txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      name: getNFTName(nft),
      address
    })
  })
export const transferNFTFailure = (nft: NFT, address: string, error: string) =>
  action(TRANSFER_NFT_FAILURE, { nft, address, error })

export type TransferNFTRequestAction = ReturnType<typeof transferNFTRequest>
export type TransferNFTSuccessAction = ReturnType<typeof transferNFTSuccess>
export type TransferNFTFailureAction = ReturnType<typeof transferNFTFailure>
