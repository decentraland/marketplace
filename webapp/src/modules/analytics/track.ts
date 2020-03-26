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
import {
  TRANSFER_NFT_SUCCESS,
  TransferNFTSuccessAction,
  FETCH_NFTS_SUCCESS,
  FetchNFTsSuccessAction
} from '../nft/actions'
import {
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS,
  AllowTokenSuccessAction,
  ApproveTokenSuccessAction
} from '../authorization/actions'
import { contractNames } from '../contract/utils'
import {
  PLACE_BID_SUCCESS,
  ACCEPT_BID_SUCCESS,
  CANCEL_BID_SUCCESS,
  ARCHIVE_BID,
  UNARCHIVE_BID,
  PlaceBidSuccessAction,
  AcceptBidSuccessAction,
  CancelBidSuccessAction,
  ArchiveBidAction,
  UnarchiveBidAction
} from '../bid/actions'

function track<T extends PayloadAction<string, any>>(
  actionType: string,
  eventName: string | ((action: T) => string),
  getPayload = (action: T) => action.payload
) {
  add(actionType, eventName as EventName, getPayload as GetPayload)
}

function withCategory(eventName: string, item: { category: string }) {
  const category = item.category[0].toUpperCase() + item.category.slice(1)
  return `${eventName} ${category}`
}

track<ExecuteOrderSuccessAction>(
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
  TRANSFER_NFT_SUCCESS,
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

track<AllowTokenSuccessAction>(ALLOW_TOKEN_SUCCESS, ({ payload }) => {
  const contractName = contractNames[payload.contractAddress]
  const tokenContractName = contractNames[payload.tokenContractAddress]
  return payload.isAllowed
    ? `Authorize ${contractName} for ${tokenContractName}`
    : `Unauthorize ${contractName} for ${tokenContractName}`
})

track<ApproveTokenSuccessAction>(APPROVE_TOKEN_SUCCESS, ({ payload }) => {
  const contractName = contractNames[payload.contractAddress]
  const tokenContractName = contractNames[payload.tokenContractAddress]
  return payload.isApproved
    ? `Authorize ${contractName} for ${tokenContractName}`
    : `Unauthorize ${contractName} for ${tokenContractName}`
})

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

track<AcceptBidSuccessAction>(
  ACCEPT_BID_SUCCESS,
  ({ payload }) => withCategory('Accept bid', payload.bid),
  ({ payload }) => ({
    category: payload.bid.category,
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    bidder: payload.bid.bidder,
    seller: payload.bid.seller
  })
)

track<CancelBidSuccessAction>(
  CANCEL_BID_SUCCESS,
  ({ payload }) => withCategory('Cancel bid', payload.bid),
  ({ payload }) => ({
    category: payload.bid.category,
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    bidder: payload.bid.bidder
  })
)

track<ArchiveBidAction>(
  ARCHIVE_BID,
  ({ payload }) => withCategory('Archive Bid', payload.bid),
  ({ payload }) => ({
    category: payload.bid.category,
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    price: payload.bid.price
  })
)

track<UnarchiveBidAction>(
  UNARCHIVE_BID,
  ({ payload }) => withCategory('Unarchive Bid', payload.bid),
  ({ payload }) => ({
    category: payload.bid.category,
    tokenId: payload.bid.tokenId,
    bidId: payload.bid.id,
    price: payload.bid.price
  })
)

track<FetchNFTsSuccessAction>(
  FETCH_NFTS_SUCCESS,
  'Fetch NFTs',
  ({ payload }) => ({
    ...payload.options.variables,
    view: payload.options.view,
    count: payload.count
  })
)
