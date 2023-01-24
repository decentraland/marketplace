import { ChainId, Order } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { ErrorCode } from 'decentraland-transactions'
import { formatWeiMANA } from '../../lib/mana'
import { getAssetName } from '../asset/utils'
import { NFT } from '../nft/types'
import { VendorName } from '../vendor'
import {
  cancelOrderFailure,
  cancelOrderRequest,
  cancelOrderSuccess,
  CANCEL_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  createOrderFailure,
  createOrderRequest,
  createOrderSuccess,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  executeOrderFailure,
  executeOrderRequest,
  executeOrderSuccess,
  executeOrderTransactionSubmitted,
  executeOrderWithCard,
  EXECUTE_ORDER_FAILURE,
  EXECUTE_ORDER_REQUEST,
  EXECUTE_ORDER_SUCCESS,
  EXECUTE_ORDER_TRANSACTION_SUBMITTED,
  EXECUTE_ORDER_WITH_CARD
} from './actions'

let nft: NFT
let order: Order
let fingerprint: string
let txHash: string
let error: string

beforeEach(() => {
  nft = {
    name: 'aName',
    contractAddress: 'aContractAddress',
    tokenId: 'aTokenId',
    openRentalId: null,
    vendor: VendorName.DECENTRALAND,
    chainId: ChainId.MATIC_MAINNET
  } as NFT
  order = {
    contractAddress: 'aContractAddress',
    tokenId: 'aTokenId',
    price: '100000000000'
  } as Order
  fingerprint = 'aFingerprint'
  txHash = 'aTxHash'
  error = 'anError'
})

describe('when creating the action to signal the start of the create order request', () => {
  it('should return an object representing the action', () => {
    expect(
      createOrderRequest(nft, Number(order.price), order.expiresAt)
    ).toEqual({
      type: CREATE_ORDER_REQUEST,
      meta: undefined,
      payload: { nft, price: Number(order.price), expiresAt: order.expiresAt }
    })
  })
})

describe('when creating the action to signal a success in the create order request', () => {
  it('should return an object representing the action', () => {
    const price = Number(order.price)
    const { expiresAt } = order

    expect(createOrderSuccess(nft, price, expiresAt, txHash)).toEqual({
      type: CREATE_ORDER_SUCCESS,
      meta: undefined,
      payload: {
        nft,
        price,
        expiresAt,
        ...buildTransactionPayload(nft.chainId, txHash, {
          tokenId: nft.tokenId,
          contractAddress: nft.contractAddress,
          network: nft.network,
          name: getAssetName(nft),
          price
        })
      }
    })
  })
})

describe('when creating the action to signal a failure in the create order request', () => {
  it('should return an object representing the action', () => {
    const price = Number(order.price)
    const { expiresAt } = order
    const errorCode = ErrorCode.EXPECTATION_FAILED

    expect(createOrderFailure(nft, price, expiresAt, error, errorCode)).toEqual(
      {
        type: CREATE_ORDER_FAILURE,
        meta: undefined,
        payload: {
          nft,
          price,
          expiresAt,
          error,
          errorCode
        }
      }
    )
  })
})

describe('when creating the action to signal the start of the execute order request', () => {
  it('should return an object representing the action', () => {
    expect(executeOrderRequest(order, nft, fingerprint)).toEqual({
      type: EXECUTE_ORDER_REQUEST,
      meta: undefined,
      payload: {
        order,
        nft,
        fingerprint
      }
    })
  })
})

describe('when creating the action to signal the submission of the executed order transaction', () => {
  it('should return an object representing the action', () => {
    expect(executeOrderTransactionSubmitted(order, nft, txHash)).toEqual({
      type: EXECUTE_ORDER_TRANSACTION_SUBMITTED,
      meta: undefined,
      payload: {
        order,
        nft,
        ...buildTransactionPayload(nft.chainId, txHash, {
          tokenId: nft.tokenId,
          contractAddress: nft.contractAddress,
          network: nft.network,
          name: getAssetName(nft),
          price: formatWeiMANA(order.price)
        })
      }
    })
  })
})

describe('when creating the action to signal a successful execute order request', () => {
  it('should return an object representing the action', () => {
    expect(executeOrderSuccess()).toEqual({
      type: EXECUTE_ORDER_SUCCESS,
      meta: undefined,
      payload: undefined
    })
  })
})

describe('when creating the action to signal a failure in the execute order request', () => {
  it('should return an object representing the action', () => {
    const errorCode = ErrorCode.EXPECTATION_FAILED

    expect(executeOrderFailure(order, nft, error, errorCode)).toEqual({
      type: EXECUTE_ORDER_FAILURE,
      meta: undefined,
      payload: { order, nft, error, errorCode }
    })
  })
})

describe('when creating the action to signal the start of the execute order with card', () => {
  it('should return an object representing the action', () => {
    expect(executeOrderWithCard(nft)).toEqual({
      type: EXECUTE_ORDER_WITH_CARD,
      meta: undefined,
      payload: { nft }
    })
  })
})

describe('when creating the action to signal the start of the cancel order request', () => {
  it('should return an object representing the action', () => {
    expect(cancelOrderRequest(order, nft)).toEqual({
      type: CANCEL_ORDER_REQUEST,
      meta: undefined,
      payload: {
        order,
        nft
      }
    })
  })
})

describe('when creating the action to signal a successful cancel order request', () => {
  it('should return an object representing the action', () => {
    expect(cancelOrderSuccess(order, nft, txHash)).toEqual({
      type: CANCEL_ORDER_SUCCESS,
      meta: undefined,
      payload: {
        order,
        nft,
        ...buildTransactionPayload(nft.chainId, txHash, {
          tokenId: nft.tokenId,
          contractAddress: nft.contractAddress,
          network: nft.network,
          name: getAssetName(nft),
          price: formatWeiMANA(order.price)
        })
      }
    })
  })
})

describe('when creating the action to signal a failure in the cancel order request', () => {
  it('should return an object representing the action', () => {
    const errorCode = ErrorCode.EXPECTATION_FAILED

    expect(cancelOrderFailure(order, nft, error, errorCode)).toEqual({
      type: CANCEL_ORDER_FAILURE,
      meta: undefined,
      payload: { order, nft, error, errorCode }
    })
  })
})
