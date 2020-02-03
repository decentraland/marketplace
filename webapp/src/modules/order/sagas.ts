import { put, call, takeEvery, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { toWei } from 'web3x-es/utils'
import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import {
  CREATE_ORDER_REQUEST,
  CreateOrderRequestAction,
  createOrderFailure,
  createOrderSuccess,
  EXECUTE_ORDER_REQUEST,
  executeOrderSuccess,
  executeOrderFailure,
  ExecuteOrderRequestAction,
  CANCEL_ORDER_REQUEST,
  CancelOrderRequestAction,
  cancelOrderSuccess,
  cancelOrderFailure
} from './actions'
import { Marketplace } from '../../contracts/Marketplace'
import { contractAddresses } from '../contract/utils'
import { getAddress } from '../wallet/selectors'
import { locations } from '../routing/locations'

export function* orderSaga() {
  yield takeEvery(CREATE_ORDER_REQUEST, handleCreateOrderRequest)
  yield takeEvery(EXECUTE_ORDER_REQUEST, handleExecuteOrderRequest)
  yield takeEvery(CANCEL_ORDER_REQUEST, handleCancelOrderRequest)
}

function* handleCreateOrderRequest(action: CreateOrderRequestAction) {
  const { nft, price, expiresAt } = action.payload
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }
    const marketplace = new Marketplace(
      eth,
      Address.fromString(contractAddresses.Marketplace)
    )
    const address = yield select(getAddress)
    if (!address) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const txHash = yield call(() =>
      marketplace.methods
        .createOrder(
          Address.fromString(nft.contractAddress),
          nft.tokenId,
          toWei(price.toString(), 'ether'),
          expiresAt
        )
        .send({ from: Address.fromString(address) })
        .getTxHash()
    )
    yield put(createOrderSuccess(nft, price, expiresAt, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(createOrderFailure(nft, price, expiresAt, error.message))
  }
}

function* handleExecuteOrderRequest(action: ExecuteOrderRequestAction) {
  const { order, nft, fingerprint } = action.payload
  try {
    if (order.nftId !== nft.id) {
      throw new Error('The order does not match the NFT')
    }
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }
    const marketplace = new Marketplace(
      eth,
      Address.fromString(contractAddresses.Marketplace)
    )
    const address = yield select(getAddress)
    if (!address) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const txHash = yield call(() => {
      if (fingerprint) {
        return marketplace.methods
          .safeExecuteOrder(
            Address.fromString(nft.contractAddress),
            nft.tokenId,
            order.price,
            fingerprint
          )
          .send({ from: Address.fromString(address) })
          .getTxHash()
      } else {
        return marketplace.methods
          .executeOrder(
            Address.fromString(nft.contractAddress),
            nft.tokenId,
            order.price
          )
          .send({ from: Address.fromString(address) })
          .getTxHash()
      }
    })
    yield put(executeOrderSuccess(order, nft, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(executeOrderFailure(order, nft, error.message))
  }
}

function* handleCancelOrderRequest(action: CancelOrderRequestAction) {
  const { nft, order } = action.payload
  try {
    if (order.nftId !== nft.id) {
      throw new Error('The order does not match the NFT')
    }
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }
    const marketplace = new Marketplace(
      eth,
      Address.fromString(contractAddresses.Marketplace)
    )
    const address = yield select(getAddress)
    if (!address) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const txHash = yield call(() =>
      marketplace.methods
        .cancelOrder(Address.fromString(nft.contractAddress), nft.tokenId)
        .send({ from: Address.fromString(address) })
        .getTxHash()
    )
    yield put(cancelOrderSuccess(order, nft, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(cancelOrderFailure(order, nft, error.message))
  }
}
