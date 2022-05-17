import { action } from 'typesafe-actions'
import { Bid, ChainId } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { NFT } from '../nft/types'
import { formatWeiMANA } from '../../lib/mana'

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
  chainId: ChainId,
  txHash: string,
  bidder: string,
  fingerprint?: string
) =>
  action(PLACE_BID_SUCCESS, {
    nft,
    price,
    expiresAt,
    bidder,
    fingerprint,
    ...buildTransactionPayload(chainId, txHash, {
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      price
    })
  })
export const placeBidFailure = (
  nft: NFT,
  price: number,
  expiresAt: number,
  error: string,
  fingerprint?: string
) =>
  action(PLACE_BID_FAILURE, {
    nft,
    price,
    expiresAt,
    error,
    fingerprint
  })

export type PlaceBidRequestAction = ReturnType<typeof placeBidRequest>
export type PlaceBidSuccessAction = ReturnType<typeof placeBidSuccess>
export type PlaceBidFailureAction = ReturnType<typeof placeBidFailure>

// Archive Bid
export const ARCHIVE_BID = 'Archive bid'
export const archiveBid = (bid: Bid) => action(ARCHIVE_BID, { bid })
export type ArchiveBidAction = ReturnType<typeof archiveBid>

// Unarchive Bid
export const UNARCHIVE_BID = 'Unarchive bid'
export const unarchiveBid = (bid: Bid) => action(UNARCHIVE_BID, { bid })
export type UnarchiveBidAction = ReturnType<typeof unarchiveBid>

// Accept Bid
export const ACCEPT_BID_REQUEST = '[Request] Accept Bid'
export const ACCEPT_BID_SUCCESS = '[Success] Accept Bid'
export const ACCEPT_BID_FAILURE = '[Failure] Accept Bid'

export const acceptBidRequest = (bid: Bid) =>
  action(ACCEPT_BID_REQUEST, { bid })
export const acceptBidSuccess = (bid: Bid, txHash: string) =>
  action(ACCEPT_BID_SUCCESS, {
    bid,
    ...buildTransactionPayload(bid.chainId, txHash, {
      tokenId: bid.tokenId,
      contractAddress: bid.contractAddress,
      price: formatWeiMANA(bid.price)
    })
  })
export const acceptBidFailure = (bid: Bid, error: string) =>
  action(ACCEPT_BID_FAILURE, { bid, error })

export type AcceptBidRequestAction = ReturnType<typeof acceptBidRequest>
export type AcceptBidSuccessAction = ReturnType<typeof acceptBidSuccess>
export type AcceptBidFailureAction = ReturnType<typeof acceptBidFailure>

// Cancel Bid
export const CANCEL_BID_REQUEST = '[Request] Cancel Bid'
export const CANCEL_BID_SUCCESS = '[Success] Cancel Bid'
export const CANCEL_BID_FAILURE = '[Failure] Cancel Bid'

export const cancelBidRequest = (bid: Bid) =>
  action(CANCEL_BID_REQUEST, { bid })
export const cancelBidSuccess = (bid: Bid, txHash: string) =>
  action(CANCEL_BID_SUCCESS, {
    bid,
    ...buildTransactionPayload(bid.chainId, txHash, {
      tokenId: bid.tokenId,
      contractAddress: bid.contractAddress,
      price: formatWeiMANA(bid.price)
    })
  })
export const cancelBidFailure = (bid: Bid, error: string) =>
  action(CANCEL_BID_FAILURE, { bid, error })

export type CancelBidRequestAction = ReturnType<typeof cancelBidRequest>
export type CancelBidSuccessAction = ReturnType<typeof cancelBidSuccess>
export type CancelBidFailureAction = ReturnType<typeof cancelBidFailure>

// Fetch Bids By Address
export const FETCH_BIDS_BY_ADDRESS_REQUEST = '[Request] Fetch bids by address'
export const FETCH_BIDS_BY_ADDRESS_SUCCESS = '[Success] Fetch bids by address'
export const FETCH_BIDS_BY_ADDRESS_FAILURE = '[Failure] Fetch bids by address'

export const fetchBidsByAddressRequest = (address: string) =>
  action(FETCH_BIDS_BY_ADDRESS_REQUEST, { address })

export const fetchBidsByAddressSuccess = (
  address: string,
  sellerBids: Bid[],
  bidderBids: Bid[]
) => action(FETCH_BIDS_BY_ADDRESS_SUCCESS, { address, sellerBids, bidderBids })

export const fetchBidsByAddressFailure = (address: string, error: string) =>
  action(FETCH_BIDS_BY_ADDRESS_FAILURE, { address, error })

export type FetchBidsByAddressRequestAction = ReturnType<
  typeof fetchBidsByAddressRequest
>
export type FetchBidsByAddressSuccessAction = ReturnType<
  typeof fetchBidsByAddressSuccess
>
export type FetchBidsByAddressFailureAction = ReturnType<
  typeof fetchBidsByAddressFailure
>

// Fetch Bids By NFT
export const FETCH_BIDS_BY_NFT_REQUEST = '[Request] Fetch bids by NFT'
export const FETCH_BIDS_BY_NFT_SUCCESS = '[Success] Fetch bids by NFT'
export const FETCH_BIDS_BY_NFT_FAILURE = '[Failure] Fetch bids by NFT'

export const fetchBidsByNFTRequest = (nft: NFT) =>
  action(FETCH_BIDS_BY_NFT_REQUEST, { nft })

export const fetchBidsByNFTSuccess = (nft: NFT, bids: Bid[]) =>
  action(FETCH_BIDS_BY_NFT_SUCCESS, { nft, bids })

export const fetchBidsByNFTFailure = (nft: NFT, error: string) =>
  action(FETCH_BIDS_BY_NFT_FAILURE, { nft, error })

export type FetchBidsByNFTRequestAction = ReturnType<
  typeof fetchBidsByNFTRequest
>
export type FetchBidsByNFTSuccessAction = ReturnType<
  typeof fetchBidsByNFTSuccess
>
export type FetchBidsByNFTFailureAction = ReturnType<
  typeof fetchBidsByNFTFailure
>
