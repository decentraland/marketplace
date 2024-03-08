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
import {
  SET_PROFILE_AVATAR_ALIAS_SUCCESS,
  SetProfileAvatarAliasSuccessAction
} from 'decentraland-dapps/dist/modules/profile'
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
  FETCH_ITEMS_SUCCESS,
  BUY_ITEM_CROSS_CHAIN_SUCCESS,
  BuyItemCrossChainSuccessAction,
  BuyItemCrossChainFailureAction,
  BUY_ITEM_CROSS_CHAIN_FAILURE
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
  CREATE_LIST_FAILURE,
  CREATE_LIST_SUCCESS,
  CreateListFailureAction,
  CreateListSuccessAction,
  DELETE_LIST_FAILURE,
  DELETE_LIST_SUCCESS,
  DeleteListFailureAction,
  DeleteListSuccessAction,
  PICK_ITEM_FAILURE,
  PICK_ITEM_SUCCESS,
  PickItemFailureAction,
  PickItemSuccessAction,
  UNPICK_ITEM_FAILURE,
  UNPICK_ITEM_SUCCESS,
  UPDATE_LIST_FAILURE,
  UPDATE_LIST_SUCCESS,
  UnpickItemFailureAction,
  UnpickItemSuccessAction,
  UpdateListFailureAction,
  UpdateListSuccessAction
} from '../favorites/actions'
import { getCategoryInfo } from '../../utils/category'
import {
  FETCH_CREATORS_ACCOUNT_SUCCESS,
  FetchCreatorsAccountSuccessAction
} from '../account/actions'
import { isUserRejectedTransactionError } from '../transaction/utils'
import {
  CLAIM_NAME_CROSS_CHAIN_SUCCESS,
  CLAIM_NAME_SUCCESS,
  ClaimNameCrossChainSuccessAction,
  ClaimNameSuccessAction
} from '../ens/actions'

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
    buyer: payload.order.buyer,
    ...getCategoryInfo(payload.nft)
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
    data: payload.item.data,
    txHash: payload.txHash,
    fromChainId: payload.chainId
  })
)

track<BuyItemCrossChainSuccessAction>(
  BUY_ITEM_CROSS_CHAIN_SUCCESS,
  events.BUY_ITEM_CROSS_CHAIN,
  ({ payload }) => {
    const {
      route: { route },
      item,
      order,
      txHash
    } = payload
    return {
      fromAmount: ethers.utils.formatUnits(
        route.estimate.fromAmount,
        route.estimate.fromToken.decimals
      ),
      fromTokenName: route.estimate.fromToken.name,
      fromToken: route.params.fromToken,
      fromChain: route.params.fromChain,
      itemId: item.itemId,
      contractAddress: item.contractAddress,
      rarity: item.rarity,
      network: item.network,
      chainId: item.chainId,
      price: Number(ethers.utils.formatEther(order?.price ?? item.price)),
      data: item.data,
      txHash,
      category: item.category
    }
  }
)

track<ClaimNameSuccessAction>(
  CLAIM_NAME_SUCCESS,
  events.BUY_NAME_SUCCESS,
  ({ payload }) => ({
    name: payload.ens.name,
    payment_method: 'crypto',
    crossChain: false,
    txHash: payload.txHash
  })
)

track<SetProfileAvatarAliasSuccessAction>(
  SET_PROFILE_AVATAR_ALIAS_SUCCESS,
  events.SET_AVATAR_NAME,
  ({ payload }) => ({
    alias: payload.alias
  })
)

track<ClaimNameCrossChainSuccessAction>(
  CLAIM_NAME_CROSS_CHAIN_SUCCESS,
  events.BUY_NAME_SUCCESS,
  ({ payload }) => {
    return {
      name: payload.ens.name,
      payment_method: 'crypto',
      crossChain: true,
      fromTokenName: payload.route.route.estimate.fromToken.name,
      fromToken: payload.route.route.params.fromToken,
      fromChain: payload.route.route.params.fromChain,
      txHash: payload.txHash
    }
  }
)

track<BuyItemCrossChainFailureAction>(
  BUY_ITEM_CROSS_CHAIN_FAILURE,
  ({ payload }) =>
    isUserRejectedTransactionError(payload.error)
      ? events.BUY_ITEM_CROSS_CHAIN_TRANSACTION_DENIED
      : events.BUY_ITEM_CROSS_CHAIN_ERROR,
  ({ payload }) => {
    const {
      route: { route },
      item,
      price
    } = payload
    return {
      fromAmount: ethers.utils.formatUnits(
        route.estimate.fromAmount,
        route.estimate.fromToken.decimals
      ),
      gasCosts: route.estimate.gasCosts[0]
        ? ethers.utils.formatUnits(
            route.estimate.gasCosts.reduce((acc, gasCost) => {
              acc = acc.add(ethers.BigNumber.from(gasCost.amount))
              return acc
            }, ethers.BigNumber.from(0)),
            route.estimate.gasCosts[0].token.decimals
          )
        : 0,
      feeCosts: route.estimate.feeCosts[0]
        ? ethers.utils.formatUnits(
            route.estimate.feeCosts.reduce((acc, feeCost) => {
              acc = acc.add(ethers.BigNumber.from(feeCost.amount))
              return acc
            }, ethers.BigNumber.from(0)),
            route.estimate.feeCosts[0].token.decimals
          )
        : 0,
      fromTokenName: route.estimate.fromToken.name,
      fromToken: route.params.fromToken,
      fromChain: route.params.fromChain,
      itemId: item.itemId,
      contractAddress: item.contractAddress,
      rarity: item.rarity,
      network: item.network,
      chainId: item.chainId,
      price: Number(ethers.utils.formatEther(price)),
      data: item.data
    }
  }
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
    purchase: payload.purchase,
    txHash: payload.purchase.txHash
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

track<PickItemSuccessAction>(
  PICK_ITEM_SUCCESS,
  events.PICK_ITEM,
  ({ payload: { item, listId } }) => ({
    item,
    listId
  })
)

track<PickItemFailureAction>(
  PICK_ITEM_FAILURE,
  events.PICK_ITEM,
  ({ payload: { item, listId, error } }) => ({
    item,
    listId,
    error
  })
)

track<UnpickItemSuccessAction>(
  UNPICK_ITEM_SUCCESS,
  events.UNPICK_ITEM,
  ({ payload: { item, listId } }) => ({
    item,
    listId
  })
)

track<UnpickItemFailureAction>(
  UNPICK_ITEM_FAILURE,
  events.UNPICK_ITEM,
  ({ payload: { item, listId, error } }) => ({
    item,
    listId,
    error
  })
)

track<CreateListSuccessAction>(
  CREATE_LIST_SUCCESS,
  events.CREATE_LIST,
  ({ payload: { list } }) => ({
    list
  })
)

track<CreateListFailureAction>(
  CREATE_LIST_FAILURE,
  events.CREATE_LIST,
  ({ payload: { error } }) => ({
    error
  })
)

track<UpdateListSuccessAction>(
  UPDATE_LIST_SUCCESS,
  events.UPDATE_LIST,
  ({ payload: { list } }) => ({
    list
  })
)

track<UpdateListFailureAction>(
  UPDATE_LIST_FAILURE,
  events.UPDATE_LIST,
  ({ payload: { id, error } }) => ({
    id,
    error
  })
)

track<DeleteListSuccessAction>(
  DELETE_LIST_SUCCESS,
  events.DELETE_LIST,
  ({ payload: { list } }) => ({
    list
  })
)

track<DeleteListFailureAction>(
  DELETE_LIST_FAILURE,
  events.DELETE_LIST,
  ({ payload: { list, error } }) => ({
    list,
    error
  })
)

track<FetchCreatorsAccountSuccessAction>(
  FETCH_CREATORS_ACCOUNT_SUCCESS,
  events.SEARCH_RESULT,
  ({ payload: { creatorAccounts, search, searchUUID } }) => ({
    tab: 'creators',
    searchTerm: search,
    searchUUID,
    creators: creatorAccounts.map(creator => creator.address)
  })
)
