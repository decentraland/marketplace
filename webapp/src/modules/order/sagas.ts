import { put, call, takeEvery, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { toWei } from 'web3x-es/utils'
import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import {
  FETCH_ORDERS_REQUEST,
  FetchOrdersRequestAction,
  DEFAULT_FETCH_ORDER_OPTIONS,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  CREATE_ORDER_REQUEST,
  CreateOrderRequestAction,
  createOrderFailure,
  createOrderSuccess
} from './actions'
import { marketplaceAPI } from '../../lib/api/marketplace'
import { Marketplace } from '../../contracts/Marketplace'
import { MARKETPLACE_ADDRESS } from '../contracts'
import { getAddress } from '../wallet/selectors'
import { locations } from '../routing/locations'

export function* orderSaga() {
  yield takeEvery(FETCH_ORDERS_REQUEST, handleFetchOrdersRequest)
  yield takeEvery(CREATE_ORDER_REQUEST, handleCreateOrderRequest)
}

function* handleFetchOrdersRequest(action: FetchOrdersRequestAction) {
  const options = {
    ...DEFAULT_FETCH_ORDER_OPTIONS,
    ...action.payload.options
  }

  try {
    const [orders, nfts] = yield call(() => marketplaceAPI.fetch(options))
    yield put(fetchOrdersSuccess(options, orders, nfts))
  } catch (error) {
    yield put(fetchOrdersFailure(options, error.message))
  }
}

function* handleCreateOrderRequest(action: CreateOrderRequestAction) {
  const { nft, price, expiresAt } = action.payload
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) throw new Error('Could not connect to Ethereum')
    const marketplace = new Marketplace(
      eth,
      Address.fromString(MARKETPLACE_ADDRESS)
    )
    const address = yield select(getAddress)
    if (!address) throw new Error('Invalid address. Wallet must be connected.')
    const tx = yield call(() =>
      marketplace.methods
        .createOrder(
          Address.fromString(nft.contractAddress),
          nft.tokenId,
          toWei(price.toString(), 'ether'),
          expiresAt
        )
        .send({ from: Address.fromString(address) })
    )
    const txHash = yield call(() => tx.txHashPromise)
    yield put(createOrderSuccess(nft, price, expiresAt, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(createOrderFailure(nft, price, expiresAt, error.message))
  }
}
