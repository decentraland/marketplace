import { takeEvery, put, select, call } from 'redux-saga/effects'
import {
  PLACE_BID_REQUEST,
  PlaceBidRequestAction,
  placeBidFailure,
  placeBidSuccess
} from './actions'
import { Eth } from 'web3x-es/eth'
import { contractAddresses } from '../contract/utils'
import { Address } from 'web3x-es/address'
import { Bids } from '../../contracts/Bids'
import { toWei } from 'web3x-es/utils'
import { getAddress } from '../wallet/selectors'
import { push } from 'connected-react-router'
import { locations } from '../routing/locations'

export function* bidSaga() {
  yield takeEvery(PLACE_BID_REQUEST, handlePlaceBidRequest)
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
