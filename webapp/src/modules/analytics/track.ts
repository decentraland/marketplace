import { PayloadAction } from 'typesafe-actions'
import { ethers } from 'ethers'
import {
  EventName,
  GetPayload
} from 'decentraland-dapps/dist/modules/analytics/types'
import {
  FETCH_TRANSACTION_FAILURE,
  FIX_REVERTED_TRANSACTION,
  REPLACE_TRANSACTION_SUCCESS,
  FetchTransactionFailureAction,
  FixRevertedTransactionAction,
  ReplaceTransactionSuccessAction
} from 'decentraland-dapps/dist/modules/transaction/actions'
import {
  GrantTokenSuccessAction,
  GRANT_TOKEN_SUCCESS,
  RevokeTokenSuccessAction,
  REVOKE_TOKEN_SUCCESS
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { add } from 'decentraland-dapps/dist/modules/analytics/utils'
import { capitalize } from '../../lib/text'
import {
  CREATE_ORDER_SUCCESS,
  CANCEL_ORDER_SUCCESS,
  EXECUTE_ORDER_TRANSACTION_SUBMITTED,
  CreateOrderSuccessAction,
  CancelOrderSuccessAction,
  ExecuteOrderTransactionSubmittedAction
} from '../order/actions'
import {
  TRANSFER_NFT_TRANSACTION_SUBMITTED,
  TransferNFTSuccessAction,
  FETCH_NFTS_SUCCESS,
  FetchNFTsSuccessAction
} from '../nft/actions'
import {
  PLACE_BID_SUCCESS,
  ACCEPT_BID_TRANSACTION_SUBMITTED,
  CANCEL_BID_SUCCESS,
  ARCHIVE_BID,
  UNARCHIVE_BID,
  PlaceBidSuccessAction,
  CancelBidSuccessAction,
  ArchiveBidAction,
  UnarchiveBidAction,
  AcceptBidTransactionSubmittedAction
} from '../bid/actions'
import {
  BuyItemSuccessAction,
  BUY_ITEM_SUCCESS,
  FetchItemsSuccessAction,
  FETCH_ITEMS_SUCCESS
} from '../item/actions'
import { SetIsTryingOnAction, SET_IS_TRYING_ON } from '../ui/preview/actions'
import { isParcel } from '../nft/utils'
import {
  AcceptRentalListingSuccessAction,
  ACCEPT_RENTAL_LISTING_SUCCESS,
  ClaimAssetSuccessAction,
  CLAIM_ASSET_SUCCESS,
  UpsertRentalSuccessAction,
  UPSERT_RENTAL_SUCCESS
} from '../rental/actions'
import { UpsertRentalOptType } from '../rental/types'
import { NFTCategory } from '@dcl/schemas'
import {
  SetPurchaseAction,
  SET_PURCHASE
} from 'decentraland-dapps/dist/modules/mana/actions'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/mana/types'

function track<T extends PayloadAction<string, any>>(
  actionType: string,
  eventName: string | ((action: T) => string),
  getPayload = (action: T) => action.payload
) {
  add(actionType, eventName as EventName, getPayload as GetPayload)
}

function withCategory(eventName: string, item: { category: string }) {
  const category = capitalize(item.category)
  return `${eventName} ${category}`
}

track<ExecuteOrderTransactionSubmittedAction>(
  EXECUTE_ORDER_TRANSACTION_SUBMITTED,
  ({ payload }) => withCategory('Buy', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    nft: payload.nft.id,
    price: payload.order.price,
    seller: payload.order.owner,
    buyer: payload.order.buyer
  })
)

track<CreateOrderSuccessAction>(
  CREATE_ORDER_SUCCESS,
  ({ payload }) => withCategory('Publish', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    tokenId: payload.nft.tokenId,
    price: payload.price
  })
)

track<CancelOrderSuccessAction>(
  CANCEL_ORDER_SUCCESS,
  ({ payload }) => withCategory('Cancel Sale', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    tokenId: payload.nft.tokenId,
    price: payload.order.price
  })
)

track<TransferNFTSuccessAction>(
  TRANSFER_NFT_TRANSACTION_SUBMITTED,
  ({ payload }) => withCategory('Transfer NFT', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    tokenId: payload.nft.tokenId,
    to: payload.address
  })
)

track<FetchTransactionFailureAction>(FETCH_TRANSACTION_FAILURE, ({ payload }) =>
  payload.status === TransactionStatus.REVERTED
    ? 'Transaction Failed'
    : 'Transaction Dropped'
)

track<FixRevertedTransactionAction>(
  FIX_REVERTED_TRANSACTION,
  'Transaction Fixed'
)

track<ReplaceTransactionSuccessAction>(
  REPLACE_TRANSACTION_SUCCESS,
  'Transaction Replaced'
)

track<GrantTokenSuccessAction>(GRANT_TOKEN_SUCCESS, () => 'Authorize')

track<RevokeTokenSuccessAction>(REVOKE_TOKEN_SUCCESS, () => 'Unauthorize')

track<PlaceBidSuccessAction>(
  PLACE_BID_SUCCESS,
  ({ payload }) => withCategory('Bid', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    tokenId: payload.nft.tokenId,
    price: payload.price,
    bidder: payload.bidder
  })
)

track<AcceptBidTransactionSubmittedAction>(
  ACCEPT_BID_TRANSACTION_SUBMITTED,
  'Accept bid',
  ({ payload }) => ({
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    bidder: payload.bid.bidder,
    seller: payload.bid.seller
  })
)

track<CancelBidSuccessAction>(
  CANCEL_BID_SUCCESS,
  'Cancel bid',
  ({ payload }) => ({
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    bidder: payload.bid.bidder
  })
)

track<ArchiveBidAction>(ARCHIVE_BID, 'Archive Bid', ({ payload }) => ({
  tokenId: payload.bid.tokenId,
  bidId: payload.bid.id,
  price: payload.bid.price
}))

track<UnarchiveBidAction>(UNARCHIVE_BID, 'Unarchive Bid', ({ payload }) => ({
  tokenId: payload.bid.tokenId,
  bidId: payload.bid.id,
  price: payload.bid.price
}))

track<FetchNFTsSuccessAction>(
  FETCH_NFTS_SUCCESS,
  'Fetch NFTs',
  ({ payload }) => ({
    ...payload.options.params,
    view: payload.options.view,
    vendor: payload.options.vendor,
    count: payload.count
  })
)

track<FetchItemsSuccessAction>(
  FETCH_ITEMS_SUCCESS,
  'Fetch Items',
  ({ payload }) => ({
    options: payload.options,
    total: payload.total
  })
)

track<BuyItemSuccessAction>(BUY_ITEM_SUCCESS, 'Buy Item', ({ payload }) => ({
  itemId: payload.item.itemId,
  contractAddress: payload.item.contractAddress,
  rarity: payload.item.rarity,
  network: payload.item.network,
  chainId: payload.item.chainId,
  price: Number(ethers.utils.formatEther(payload.item.price)),
  data: payload.item.data
}))

track<SetIsTryingOnAction>(
  SET_IS_TRYING_ON,
  'Toggle Preview Mode',
  ({ payload }) => ({
    mode: payload.value ? 'avatar' : 'wearable'
  })
)

track<UpsertRentalSuccessAction>(
  UPSERT_RENTAL_SUCCESS,
  'Upsert Land Rental',
  ({ payload: { nft, operationType, rental } }) => ({
    nftId: nft.id,
    assetType: isParcel(nft) ? NFTCategory.PARCEL : NFTCategory.ESTATE,
    rentalId: rental.id,
    pricePerDay: rental.periods[0].pricePerDay, // we're accepting just one price per day for all periods
    operation: operationType === UpsertRentalOptType.EDIT ? 'edit' : 'create',
    periods: rental.periods.map(period => period.maxDays).join(','), // maxDays is going to tell the duration for now
    experiesAt: rental.expiration
  })
)

track<ClaimAssetSuccessAction>(
  CLAIM_ASSET_SUCCESS,
  'Claim Land Rental',
  ({ payload: { nft, rental } }) => ({
    nftId: nft.id,
    rentalId: rental.id
  })
)

track<AcceptRentalListingSuccessAction>(
  ACCEPT_RENTAL_LISTING_SUCCESS,
  'Rent Land',
  ({ payload: { periodIndexChosen, rental, nft } }) => ({
    nftId: rental.nftId,
    assetType: isParcel(nft) ? NFTCategory.PARCEL : NFTCategory.ESTATE,
    rentalId: rental.id,
    pricePerDay: rental.periods[periodIndexChosen].pricePerDay,
    duration: rental.periods[periodIndexChosen].maxDays
  })
)

track<SetPurchaseAction>(
  SET_PURCHASE,
  action =>
    action.payload.purchase.status === PurchaseStatus.CANCELLED
      ? 'Purchase Cancelled'
      : action.payload.purchase.status === PurchaseStatus.COMPLETE
      ? 'Purchase Complete'
      : action.payload.purchase.status === PurchaseStatus.FAILED
      ? 'Purchase Failed'
      : 'Purchase Started',
  action => action.payload.purchase
)
