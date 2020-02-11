import {
  EventName,
  GetPayload
} from 'decentraland-dapps/dist/modules/analytics/types'
import {
  FETCH_TRANSACTION_FAILURE,
  FIX_REVERTED_TRANSACTION,
  REPLACE_TRANSACTION_SUCCESS
} from 'decentraland-dapps/dist/modules/transaction/actions'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { add } from 'decentraland-dapps/dist/modules/analytics/utils'
import { PayloadAction } from 'typesafe-actions'
import {
  EXECUTE_ORDER_SUCCESS,
  CREATE_ORDER_SUCCESS,
  CANCEL_ORDER_SUCCESS,
  ExecuteOrderSuccessAction,
  CreateOrderSuccessAction,
  CancelOrderSuccessAction
} from '../order/actions'
import { TRANSFER_NFT_SUCCESS, TransferNFTSuccessAction } from '../nft/actions'
import {
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from '../authorization/actions'
import { NFT } from '../nft/types'

function addWithPayload<T extends PayloadAction<string, any>>(
  actionType: string,
  eventName: string | ((action: T) => string),
  getPayload = (action: T) => action.payload
) {
  add(actionType, eventName as EventName, getPayload as GetPayload)
}

function withCategory(eventName: string, nft: NFT) {
  const category = nft.category[0].toUpperCase() + nft.category.slice(1)
  return `${eventName} ${category}`
}

addWithPayload<ExecuteOrderSuccessAction>(
  EXECUTE_ORDER_SUCCESS,
  ({ payload }) => withCategory('Buy', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    nft: payload.nft.id,
    price: payload.order.price,
    seller: payload.order.owner,
    buyer: payload.order.buyer
  })
)

addWithPayload<CreateOrderSuccessAction>(
  CREATE_ORDER_SUCCESS,
  ({ payload }) => withCategory('Publish', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    nftId: payload.nft.id,
    price: payload.price
  })
)

addWithPayload(
  CANCEL_ORDER_SUCCESS,
  ({ payload }) => withCategory('Cancel Sale', payload.nft),
  ({ payload }: CancelOrderSuccessAction) => ({
    category: payload.nft.category,
    nftId: payload.nft.id,
    price: payload.order.price
  })
)

addWithPayload(
  TRANSFER_NFT_SUCCESS,
  ({ payload }) => withCategory('Transfer NFT', payload.nft),
  ({ payload }: TransferNFTSuccessAction) => ({
    category: payload.nft.category,
    assetId: payload.nft.id,
    to: payload.address
  })
)

add(
  FETCH_TRANSACTION_FAILURE,
  action =>
    action.payload.status === TransactionStatus.REVERTED
      ? 'Transaction Failed'
      : 'Transaction Dropped',
  action => action.payload
)

add(FIX_REVERTED_TRANSACTION, 'Transaction Fixed', action => action.payload)

add(
  REPLACE_TRANSACTION_SUCCESS,
  'Transaction Replaced',
  action => action.payload
)

add(ALLOW_TOKEN_SUCCESS, ({ payload }) =>
  payload.amount > 0
    ? `Authorize ${payload.contractName} for ${payload.tokenContractName}`
    : `Unauthorize ${payload.contractName} for ${payload.tokenContractName}`
)

add(APPROVE_TOKEN_SUCCESS, ({ payload }) =>
  payload.isApproved
    ? `Authorize ${payload.contractName} for ${payload.tokenContractName}`
    : `Unauthorize ${payload.contractName} for ${payload.tokenContractName}`
)

// TODO:

// addWithPayload(BID_ON_PARCELS_SUCCESS, 'Bid on parcels', action => ({
//   beneficiary: action.beneficiary,
//   parcels: action.xs.map((x, index) => `${x}, ${action.ys[index]}`).join(', '),
//   currentPrice: action.params.currentPrice,
//   token: action.params.token,
//   rate: action.params.rate
// }))

// addWithPayload(
//   BID_SUCCESS,
//   ({ bid }) => addAssetType('Bid', bid.asset_type),
//   ({ bid }) => ({
//     assetId: bid.asset_id,
//     price: bid.price,
//     bidder: bid.bidder
//   })
// )

// addWithPayload(
//   ACCEPT_BID_SUCCESS,
//   ({ bid }) => addAssetType('Accept bid', bid.asset_type),
//   ({ bid }) => ({
//     id: bid.id,
//     assetId: bid.asset_id,
//     bidder: bid.bidder,
//     seller: bid.seller
//   })
// )

// addWithPayload(
//   CANCEL_BID_SUCCESS,
//   ({ bid }) => addAssetType('Cancel bid', bid.asset_type),
//   ({ bid }) => ({
//     id: bid.id,
//     assetId: bid.asset_id,
//     bidder: bid.bidder
//   })
// )

// track(
//   ARCHIVE_BID,
//   ({ bid }) => addAssetType('Archive Bid', bid.asset_type),
//   ({ bid }) => ({
//     id: bid.id,
//     assetId: bid.asset_id,
//     price: bid.price
//   })
// )

// track(
//   UNARCHIVE_BID,
//   ({ bid }) => addAssetType('Unarchive Bid', bid.asset_type),
//   ({ bid }) => ({
//     id: bid.id,
//     assetId: bid.asset_id,
//     price: bid.price
//   })
// )
