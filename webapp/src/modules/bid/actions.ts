import { action } from 'typesafe-actions'
import { Bid, ChainId } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { formatWeiMANA } from '../../lib/mana'
import { Asset } from '../asset/types'
import { isNFT } from '../asset/utils'

// Place Bid
export const PLACE_BID_REQUEST = '[Request] Place Bid'
export const PLACE_BID_SUCCESS = '[Success] Place Bid'
export const PLACE_BID_FAILURE = '[Failure] Place Bid'

export const placeBidRequest = (asset: Asset, price: number, expiresAt: number, fingerprint?: string) =>
  action(PLACE_BID_REQUEST, { asset, price, expiresAt, fingerprint })
export const placeBidSuccess = (
  asset: Asset,
  price: number,
  expiresAt: number,
  chainId: ChainId,
  bidder: string,
  fingerprint?: string,
  txHash?: string
) => {
  return action(PLACE_BID_SUCCESS, {
    asset,
    price,
    expiresAt,
    bidder,
    fingerprint,
    ...(txHash
      ? buildTransactionPayload(chainId, txHash, {
          ...(isNFT(asset) ? { tokenId: asset.tokenId } : { itemId: asset.itemId }),
          contractAddress: asset.contractAddress,
          price
        })
      : {})
  })
}

export const placeBidFailure = (asset: Asset, price: number, expiresAt: number, error: string, fingerprint?: string) =>
  action(PLACE_BID_FAILURE, {
    asset,
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
export const ACCEPT_BID_TRANSACTION_SUBMITTED = '[Submitted transaction] Accept Bid'

export const acceptBidRequest = (bid: Bid) => action(ACCEPT_BID_REQUEST, { bid })
export const acceptBidSuccess = (bid: Bid) =>
  action(ACCEPT_BID_SUCCESS, {
    bid
  })
export const acceptBidFailure = (bid: Bid, error: string) => action(ACCEPT_BID_FAILURE, { bid, error })

export const acceptBidtransactionSubmitted = (bid: Bid, txHash: string) =>
  action(ACCEPT_BID_TRANSACTION_SUBMITTED, {
    bid,
    ...buildTransactionPayload(bid.chainId, txHash, {
      ...('tokenId' in bid ? { tokenId: bid.tokenId } : { itemId: bid.itemId }),
      contractAddress: bid.contractAddress,
      price: formatWeiMANA(bid.price)
    })
  })

export type AcceptBidRequestAction = ReturnType<typeof acceptBidRequest>
export type AcceptBidSuccessAction = ReturnType<typeof acceptBidSuccess>
export type AcceptBidFailureAction = ReturnType<typeof acceptBidFailure>
export type AcceptBidTransactionSubmittedAction = ReturnType<typeof acceptBidtransactionSubmitted>

// Cancel Bid
export const CANCEL_BID_REQUEST = '[Request] Cancel Bid'
export const CANCEL_BID_SUCCESS = '[Success] Cancel Bid'
export const CANCEL_BID_FAILURE = '[Failure] Cancel Bid'

export const cancelBidRequest = (bid: Bid) => action(CANCEL_BID_REQUEST, { bid })
export const cancelBidSuccess = (bid: Bid, txHash: string) =>
  action(CANCEL_BID_SUCCESS, {
    bid,
    ...buildTransactionPayload(bid.chainId, txHash, {
      ...('tokenId' in bid ? { tokenId: bid.tokenId } : { itemId: bid.itemId }),
      contractAddress: bid.contractAddress,
      price: formatWeiMANA(bid.price)
    })
  })
export const cancelBidFailure = (bid: Bid, error: string) => action(CANCEL_BID_FAILURE, { bid, error })

export type CancelBidRequestAction = ReturnType<typeof cancelBidRequest>
export type CancelBidSuccessAction = ReturnType<typeof cancelBidSuccess>
export type CancelBidFailureAction = ReturnType<typeof cancelBidFailure>

// Fetch Bids By Address
export const FETCH_BIDS_BY_ADDRESS_REQUEST = '[Request] Fetch bids by address'
export const FETCH_BIDS_BY_ADDRESS_SUCCESS = '[Success] Fetch bids by address'
export const FETCH_BIDS_BY_ADDRESS_FAILURE = '[Failure] Fetch bids by address'

export const fetchBidsByAddressRequest = (address: string) => action(FETCH_BIDS_BY_ADDRESS_REQUEST, { address })

export const fetchBidsByAddressSuccess = (address: string, sellerBids: Bid[], bidderBids: Bid[]) =>
  action(FETCH_BIDS_BY_ADDRESS_SUCCESS, { address, sellerBids, bidderBids })

export const fetchBidsByAddressFailure = (address: string, error: string) => action(FETCH_BIDS_BY_ADDRESS_FAILURE, { address, error })

export type FetchBidsByAddressRequestAction = ReturnType<typeof fetchBidsByAddressRequest>
export type FetchBidsByAddressSuccessAction = ReturnType<typeof fetchBidsByAddressSuccess>
export type FetchBidsByAddressFailureAction = ReturnType<typeof fetchBidsByAddressFailure>

// Fetch Bids By NFT
export const FETCH_BIDS_BY_ASSET_REQUEST = '[Request] Fetch bids by Asset'
export const FETCH_BIDS_BY_ASSET_SUCCESS = '[Success] Fetch bids by Asset'
export const FETCH_BIDS_BY_ASSET_FAILURE = '[Failure] Fetch bids by Asset'

export const fetchBidsByAssetRequest = (asset: Asset) => action(FETCH_BIDS_BY_ASSET_REQUEST, { asset })

export const fetchBidsByAssetSuccess = (asset: Asset, bids: Bid[]) => action(FETCH_BIDS_BY_ASSET_SUCCESS, { asset, bids })

export const fetchBidsByAssetFailure = (asset: Asset, error: string) => action(FETCH_BIDS_BY_ASSET_FAILURE, { asset, error })

export type FetchBidsByAssetRequestAction = ReturnType<typeof fetchBidsByAssetRequest>
export type FetchBidsByAssetSuccessAction = ReturnType<typeof fetchBidsByAssetSuccess>
export type FetchBidsByAssetFailureAction = ReturnType<typeof fetchBidsByAssetFailure>

export const CLEAR_BID_ERROR = 'Clear Bid Error'

export const clearBidError = () => action(CLEAR_BID_ERROR)

export type ClearBidErrorAction = ReturnType<typeof clearBidError>
