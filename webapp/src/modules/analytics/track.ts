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
  ExecuteOrderTransactionSubmittedAction,
  ExecuteOrderWithCardSuccessAction,
  EXECUTE_ORDER_WITH_CARD_SUCCESS
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
  BuyItemWithCardSuccessAction,
  BUY_ITEM_SUCCESS,
  BUY_ITEM_WITH_CARD_SUCCESS,
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
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import * as events from '../../utils/events'
import {
  BULK_PICK_FAILURE,
  BULK_PICK_SUCCESS,
  BulkPickUnpickFailureAction,
  BulkPickUnpickSuccessAction,
  PICK_ITEM_AS_FAVORITE_FAILURE,
  PICK_ITEM_AS_FAVORITE_SUCCESS,
  PickItemAsFavoriteFailureAction,
  PickItemAsFavoriteSuccessAction,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS,
  UNPICK_ITEM_AS_FAVORITE_FAILURE,
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  UndoUnpickingItemAsFavoriteFailureAction,
  UndoUnpickingItemAsFavoriteSuccessAction,
  UnpickItemAsFavoriteFailureAction,
  UnpickItemAsFavoriteSuccessAction
} from '../favorites/actions'
import { DEFAULT_FAVORITES_LIST_ID } from '../vendor/decentraland/favorites'

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
  ({ payload }) => withCategory(events.BUY, payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    nft: payload.nft.id,
    price: payload.order.price,
    seller: payload.order.owner,
    buyer: payload.order.buyer
  })
)

track<ExecuteOrderWithCardSuccessAction>(
  EXECUTE_ORDER_WITH_CARD_SUCCESS,
  ({ payload }) => withCategory(events.BUY_WITH_CARD, payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    nft: payload.nft.id,
    price: payload.purchase.nft.cryptoAmount,
    seller: payload.nft.owner,
    buyer: payload.purchase.address
  })
)

track<CreateOrderSuccessAction>(
  CREATE_ORDER_SUCCESS,
  ({ payload }) => withCategory(events.PUBLISH, payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    tokenId: payload.nft.tokenId,
    price: payload.price
  })
)

track<CancelOrderSuccessAction>(
  CANCEL_ORDER_SUCCESS,
  ({ payload }) => withCategory(events.CANCEL_SALE, payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    tokenId: payload.nft.tokenId,
    price: payload.order.price
  })
)

track<TransferNFTSuccessAction>(
  TRANSFER_NFT_TRANSACTION_SUBMITTED,
  ({ payload }) => withCategory(events.TRANSFER_NFT, payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    tokenId: payload.nft.tokenId,
    to: payload.address
  })
)

track<FetchTransactionFailureAction>(FETCH_TRANSACTION_FAILURE, ({ payload }) =>
  payload.status === TransactionStatus.REVERTED
    ? events.TRANSACTION_FAILED
    : events.TRANSACTION_DROPPED
)

track<FixRevertedTransactionAction>(
  FIX_REVERTED_TRANSACTION,
  events.TRANSACTION_FIXED
)

track<ReplaceTransactionSuccessAction>(
  REPLACE_TRANSACTION_SUCCESS,
  events.TRANSACTION_REPLACED
)

track<GrantTokenSuccessAction>(GRANT_TOKEN_SUCCESS, () => events.AUTHORIZE)

track<RevokeTokenSuccessAction>(REVOKE_TOKEN_SUCCESS, () => events.UNAUTHORIZE)

track<PlaceBidSuccessAction>(
  PLACE_BID_SUCCESS,
  ({ payload }) => withCategory(events.BID, payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    tokenId: payload.nft.tokenId,
    price: payload.price,
    bidder: payload.bidder
  })
)

track<AcceptBidTransactionSubmittedAction>(
  ACCEPT_BID_TRANSACTION_SUBMITTED,
  events.ACCEPT_BID,
  ({ payload }) => ({
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    bidder: payload.bid.bidder,
    seller: payload.bid.seller
  })
)

track<CancelBidSuccessAction>(
  CANCEL_BID_SUCCESS,
  events.CANCEL_BID,
  ({ payload }) => ({
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    bidder: payload.bid.bidder
  })
)

track<ArchiveBidAction>(ARCHIVE_BID, events.ARCHIVE_BID, ({ payload }) => ({
  tokenId: payload.bid.tokenId,
  bidId: payload.bid.id,
  price: payload.bid.price
}))

track<UnarchiveBidAction>(
  UNARCHIVE_BID,
  events.UNARCHIVE_BID,
  ({ payload }) => ({
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    price: payload.bid.price
  })
)

track<FetchNFTsSuccessAction>(
  FETCH_NFTS_SUCCESS,
  events.FETCH_NFTS,
  ({ payload }) => ({
    ...payload.options.params,
    view: payload.options.view,
    vendor: payload.options.vendor,
    count: payload.count
  })
)

track<FetchItemsSuccessAction>(
  FETCH_ITEMS_SUCCESS,
  events.FETCH_ITEMS,
  ({ payload }) => ({
    options: payload.options,
    total: payload.total
  })
)

track<BuyItemSuccessAction>(
  BUY_ITEM_SUCCESS,
  events.BUY_ITEM,
  ({ payload }) => ({
    itemId: payload.item.itemId,
    contractAddress: payload.item.contractAddress,
    rarity: payload.item.rarity,
    network: payload.item.network,
    chainId: payload.item.chainId,
    price: Number(ethers.utils.formatEther(payload.item.price)),
    data: payload.item.data
  })
)

track<BuyItemWithCardSuccessAction>(
  BUY_ITEM_WITH_CARD_SUCCESS,
  events.BUY_ITEM_WITH_CARD,
  ({ payload }) => ({
    itemId: payload.item.itemId,
    contractAddress: payload.item.contractAddress,
    rarity: payload.item.rarity,
    network: payload.item.network,
    chainId: payload.item.chainId,
    price: payload.purchase.nft.cryptoAmount,
    data: payload.item.data,
    purchase: payload.purchase
  })
)

track<SetIsTryingOnAction>(
  SET_IS_TRYING_ON,
  events.TOGGLE_PREVIEW_MODE,
  ({ payload }) => ({
    mode: payload.value ? 'avatar' : 'wearable'
  })
)

track<UpsertRentalSuccessAction>(
  UPSERT_RENTAL_SUCCESS,
  events.UPSERT_LAND_RENTAL,
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
  events.CLAIM_LAND_RENTAL,
  ({ payload: { nft, rental } }) => ({
    nftId: nft.id,
    rentalId: rental.id
  })
)

track<AcceptRentalListingSuccessAction>(
  ACCEPT_RENTAL_LISTING_SUCCESS,
  events.RENT_LAND,
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
      ? events.PURCHASED_CANCELLED
      : action.payload.purchase.status === PurchaseStatus.COMPLETE
      ? events.PURCHASED_COMPLETE
      : action.payload.purchase.status === PurchaseStatus.REFUNDED
      ? events.PURCHASED_REFUNDED
      : action.payload.purchase.status === PurchaseStatus.FAILED
      ? events.PURCHASED_FAILED
      : events.PURCHASED_STARTED,
  action => action.payload.purchase
)

track<PickItemAsFavoriteSuccessAction>(
  PICK_ITEM_AS_FAVORITE_SUCCESS,
  events.PICK_ITEM,
  ({ payload: { item } }) => ({
    item,
    listId: DEFAULT_FAVORITES_LIST_ID
  })
)

track<PickItemAsFavoriteFailureAction>(
  PICK_ITEM_AS_FAVORITE_FAILURE,
  events.PICK_ITEM,
  ({ payload: { item, error } }) => ({
    item,
    listId: DEFAULT_FAVORITES_LIST_ID,
    error
  })
)

track<UnpickItemAsFavoriteSuccessAction>(
  UNPICK_ITEM_AS_FAVORITE_SUCCESS,
  events.UNPICK_ITEM,
  ({ payload: { item } }) => ({
    item,
    listId: DEFAULT_FAVORITES_LIST_ID
  })
)

track<UnpickItemAsFavoriteFailureAction>(
  UNPICK_ITEM_AS_FAVORITE_FAILURE,
  events.UNPICK_ITEM,
  ({ payload: { item, error } }) => ({
    item,
    listId: DEFAULT_FAVORITES_LIST_ID,
    error
  })
)

track<UndoUnpickingItemAsFavoriteSuccessAction>(
  UNDO_UNPICKING_ITEM_AS_FAVORITE_SUCCESS,
  events.UNDO_UNPICK_ITEM,
  ({ payload: { item } }) => ({
    item,
    listId: DEFAULT_FAVORITES_LIST_ID
  })
)

track<UndoUnpickingItemAsFavoriteFailureAction>(
  UNDO_UNPICKING_ITEM_AS_FAVORITE_FAILURE,
  events.UNDO_UNPICK_ITEM,
  ({ payload: { item, error } }) => ({
    item,
    listId: DEFAULT_FAVORITES_LIST_ID,
    error
  })
)

track<BulkPickUnpickSuccessAction>(
  BULK_PICK_SUCCESS,
  events.BULK_PICK,
  ({ payload: { item, pickedFor, unpickedFrom } }) => ({
    item,
    pickedFor,
    unpickedFrom
  })
)

track<BulkPickUnpickFailureAction>(
  BULK_PICK_FAILURE,
  events.BULK_PICK,
  ({ payload: { item, pickedFor, unpickedFrom, error } }) => ({
    item,
    pickedFor,
    unpickedFrom,
    error
  })
)
