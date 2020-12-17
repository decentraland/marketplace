import { takeEvery, call, put } from 'redux-saga/effects'
import { Atlas } from 'decentraland-ui'
import { ATLAS_URL } from '../../modules/vendor/decentraland'
import {
  FETCH_TILES_REQUEST,
  FetchTilesRequestAction,
  fetchTilesSuccess,
  fetchTilesFailure
} from './actions'
import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { fetchNFTsRequest } from '../nft/actions'
import { Vendors } from '../vendor'
import { View } from '../ui/types'

export function* tileSaga() {
  yield takeEvery(FETCH_TILES_REQUEST, handleFetchTilesRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleFetchTilesRequest(_action: FetchTilesRequestAction) {
  try {
    const tiles = yield call(() => Atlas.fetchTiles(ATLAS_URL + '/tiles'))
    yield put(fetchTilesSuccess(tiles))
  } catch (error) {
    yield put(fetchTilesFailure(error.message))
  }
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  yield put(
    fetchNFTsRequest({
      vendor: Vendors.DECENTRALAND,
      view: View.ATLAS,
      params: {
        first: 1000,
        skip: 0,
        address: action.payload.wallet.address.toLowerCase()
      },
      filters: {
        isLand: true
      }
    })
  )
}
