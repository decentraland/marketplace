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
  APPROVE_TOKEN_SUCCESS,
  AllowTokenSuccessAction,
  ApproveTokenSuccessAction
} from '../authorization/actions'
import { NFT } from '../nft/types'
import { getContractName } from '../contract/utils'

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

addWithPayload<CancelOrderSuccessAction>(
  CANCEL_ORDER_SUCCESS,
  ({ payload }) => withCategory('Cancel Sale', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    nftId: payload.nft.id,
    price: payload.order.price
  })
)

addWithPayload<TransferNFTSuccessAction>(
  TRANSFER_NFT_SUCCESS,
  ({ payload }) => withCategory('Transfer NFT', payload.nft),
  ({ payload }) => ({
    category: payload.nft.category,
    assetId: payload.nft.id,
    to: payload.address
  })
)

addWithPayload<FetchTransactionFailureAction>(
  FETCH_TRANSACTION_FAILURE,
  ({ payload }) =>
    payload.status === TransactionStatus.REVERTED
      ? 'Transaction Failed'
      : 'Transaction Dropped'
)

addWithPayload<FixRevertedTransactionAction>(
  FIX_REVERTED_TRANSACTION,
  'Transaction Fixed'
)

addWithPayload<ReplaceTransactionSuccessAction>(
  REPLACE_TRANSACTION_SUCCESS,
  'Transaction Replaced'
)

addWithPayload<AllowTokenSuccessAction>(ALLOW_TOKEN_SUCCESS, ({ payload }) => {
  const contractName = getContractName(payload.contractAddress)
  const tokenContractName = getContractName(payload.tokenContractAddress)
  return payload.isAllowed
    ? `Authorize ${contractName} for ${tokenContractName}`
    : `Unauthorize ${contractName} for ${tokenContractName}`
})

addWithPayload<ApproveTokenSuccessAction>(
  APPROVE_TOKEN_SUCCESS,
  ({ payload }) => {
    const contractName = getContractName(payload.contractAddress)
    const tokenContractName = getContractName(payload.tokenContractAddress)
    return payload.isApproved
      ? `Authorize ${contractName} for ${tokenContractName}`
      : `Unauthorize ${contractName} for ${tokenContractName}`
  }
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
