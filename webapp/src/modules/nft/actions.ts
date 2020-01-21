import { action } from 'typesafe-actions'
import { NFT } from './types'
import { Order } from '../order/types'

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
