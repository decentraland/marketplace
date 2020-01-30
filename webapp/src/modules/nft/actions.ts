import { action } from 'typesafe-actions'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { NFT } from './types'
import { getNFTName } from './utils'
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
