import { action } from 'typesafe-actions'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { NFT } from '../nft/types'
import { getNFTName } from '../nft/utils'

// Place Bid

export const PLACE_BID_REQUEST = '[Request] Place Bid'
export const PLACE_BID_SUCCESS = '[Success] Place Bid'
export const PLACE_BID_FAILURE = '[Failure] Place Bid'

export const placeBidRequest = (
  nft: NFT,
  price: number,
  expiresAt: number,
  fingerprint?: string
) => action(PLACE_BID_REQUEST, { nft, price, expiresAt, fingerprint })
export const placeBidSuccess = (
  nft: NFT,
  price: number,
  expiresAt: number,
  txHash: string,
  fingerprint?: string
) =>
  action(PLACE_BID_SUCCESS, {
    nft,
    price,
    expiresAt,
    fingerprint,
    ...buildTransactionPayload(txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      name: getNFTName(nft),
      price
    })
  })
export const placeBidFailure = (
  nft: NFT,
  price: number,
  expiresAt: number,
  error: string,
  fingerprint?: string
) => action(PLACE_BID_FAILURE, { nft, price, expiresAt, error, fingerprint })

export type PlaceBidRequestAction = ReturnType<typeof placeBidRequest>
export type PlaceBidSuccessAction = ReturnType<typeof placeBidSuccess>
export type PlaceBidFailureAction = ReturnType<typeof placeBidFailure>
