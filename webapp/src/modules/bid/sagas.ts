import { push } from 'connected-react-router'
import { takeEvery, put, select, call } from 'redux-saga/effects'
import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { toWei } from 'web3x-es/utils'
import {
  PLACE_BID_REQUEST,
  PlaceBidRequestAction,
  placeBidFailure,
  placeBidSuccess,
  FETCH_BIDS_BY_ADDRESS_REQUEST,
  fetchBidsByAddressSuccess,
  fetchBidsByAddressFailure,
  FetchBidsByAddressRequestAction,
  ACCEPT_BID_REQUEST,
  CANCEL_BID_REQUEST,
  AcceptBidRequestAction,
  acceptBidSuccess,
  acceptBidFailure,
  CancelBidRequestAction,
  cancelBidSuccess,
  cancelBidFailure,
  FETCH_BIDS_BY_NFT_REQUEST,
  FetchBidsByNFTRequestAction,
  fetchBidsByNFTSuccess,
  fetchBidsByNFTFailure
} from './actions'
import { contractAddresses } from '../contract/utils'
import { Bids } from '../../contracts/Bids'
import { getAddress } from '../wallet/selectors'
import { locations } from '../routing/locations'
import { bidAPI } from '../../lib/api/bid'
import { ERC721 } from '../../contracts/ERC721'

export function* bidSaga() {
  yield takeEvery(PLACE_BID_REQUEST, handlePlaceBidRequest)
  yield takeEvery(ACCEPT_BID_REQUEST, handleAcceptBidRequest)
  yield takeEvery(CANCEL_BID_REQUEST, handleCancelBidRequest)
  yield takeEvery(
    FETCH_BIDS_BY_ADDRESS_REQUEST,
    handleFetchBidsByAddressRequest
  )
  yield takeEvery(FETCH_BIDS_BY_NFT_REQUEST, handleFetchBidsByNFTRequest)
}

function* handlePlaceBidRequest(action: PlaceBidRequestAction) {
  const { nft, price, expiresAt, fingerprint } = action.payload
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }
    const bids = new Bids(eth, Address.fromString(contractAddresses.Bids))
    const address = yield select(getAddress)
    if (!address) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const txHash = yield call(() => {
      const priceInWei = toWei(price.toString(), 'ether')
      const expiresIn = Math.round((expiresAt - Date.now()) / 1000)
      if (fingerprint) {
        return bids.methods
          .placeBid(
            Address.fromString(nft.contractAddress),
            nft.tokenId,
            priceInWei,
            expiresIn,
            fingerprint
          )
          .send({ from: Address.fromString(address) })
          .getTxHash()
      } else {
        return bids.methods
          .placeBid(
            Address.fromString(nft.contractAddress),
            nft.tokenId,
            priceInWei,
            expiresIn
          )
          .send({ from: Address.fromString(address) })
          .getTxHash()
      }
    })
    yield put(placeBidSuccess(nft, price, expiresAt, txHash, fingerprint))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(placeBidFailure(nft, price, expiresAt, error, fingerprint))
  }
}

function* handleAcceptBidRequest(action: AcceptBidRequestAction) {
  const { bid } = action.payload
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }
    const erc721 = new ERC721(eth, Address.fromString(bid.contractAddress))
    const address = yield select(getAddress)
    if (!address) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const txHash = yield call(() => {
      return erc721.methods
        .safeTransferFrom(
          Address.fromString(address),
          Address.fromString(contractAddresses.Bids),
          bid.tokenId,
          bid.id
        )
        .send({ from: Address.fromString(address) })
        .getTxHash()
    })
    yield put(acceptBidSuccess(bid, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(acceptBidFailure(bid, error.message))
  }
}

function* handleCancelBidRequest(action: CancelBidRequestAction) {
  const { bid } = action.payload
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }
    const bids = new Bids(eth, Address.fromString(contractAddresses.Bids))
    const address = yield select(getAddress)
    if (!address) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const txHash = yield call(() => {
      return bids.methods
        .cancelBid(Address.fromString(bid.contractAddress), bid.tokenId)
        .send({ from: Address.fromString(address) })
        .getTxHash()
    })
    yield put(cancelBidSuccess(bid, txHash))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(cancelBidFailure(bid, error.message))
  }
}

function* handleFetchBidsByAddressRequest(
  action: FetchBidsByAddressRequestAction
) {
  const { address } = action.payload
  try {
    const [seller, bidder] = yield call(() =>
      Promise.all([
        bidAPI.fetchBySeller(address),
        bidAPI.fetchByBidder(address)
      ])
    )
    yield put(fetchBidsByAddressSuccess(address, seller, bidder))
  } catch (error) {
    yield put(fetchBidsByAddressFailure(address, error.message))
  }
}

function* handleFetchBidsByNFTRequest(action: FetchBidsByNFTRequestAction) {
  const { nft } = action.payload
  try {
    const bids = yield call(() => bidAPI.fetchByNFT(nft))
    yield put(fetchBidsByNFTSuccess(nft, bids))
  } catch (error) {
    yield put(fetchBidsByNFTFailure(nft, error.message))
  }
}
