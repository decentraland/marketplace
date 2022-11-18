import { takeEvery, call, put, select } from 'redux-saga/effects'
import { RentalStatus } from '@dcl/schemas'
import { Atlas, AtlasTile } from 'decentraland-ui'
import { ATLAS_SERVER_URL } from '../../modules/vendor/decentraland'
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
import { VendorName } from '../vendor'
import { View } from '../ui/types'
import { getIsRentalsEnabled } from '../features/selectors'

export function* tileSaga() {
  yield takeEvery(FETCH_TILES_REQUEST, handleFetchTilesRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleFetchTilesRequest(_action: FetchTilesRequestAction) {
  try {
    const tiles: Record<string, AtlasTile> = yield call(() =>
      Atlas.fetchTiles(ATLAS_SERVER_URL + '/v1/tiles')
    )
    yield put(fetchTilesSuccess(tiles))
  } catch (error) {
    yield put(fetchTilesFailure(error.message))
  }
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  const isRentalsEnabled: boolean = yield select(getIsRentalsEnabled)
  yield put(
    fetchNFTsRequest({
      vendor: VendorName.DECENTRALAND,
      view: View.ATLAS,
      params: {
        first: 1000,
        skip: 0,
        address: action.payload.wallet.address.toLowerCase()
      },
      filters: {
        isLand: true,
        rentalStatus: isRentalsEnabled
          ? [RentalStatus.OPEN, RentalStatus.CANCELLED, RentalStatus.EXECUTED]
          : undefined
      }
    })
  )
}
