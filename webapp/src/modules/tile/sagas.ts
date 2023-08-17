import { takeEvery, call, put } from 'redux-saga/effects'
import { RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ConnectWalletSuccessAction, CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Atlas, AtlasTile } from 'decentraland-ui'
import { isErrorWithMessage } from '../../lib/error'
import { ATLAS_SERVER_URL } from '../../modules/vendor/decentraland'
import { fetchNFTsRequest } from '../nft/actions'
import { View } from '../ui/types'
import { VendorName } from '../vendor'
import { FETCH_TILES_REQUEST, FetchTilesRequestAction, fetchTilesSuccess, fetchTilesFailure } from './actions'

export function* tileSaga() {
  yield takeEvery(FETCH_TILES_REQUEST, handleFetchTilesRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleFetchTilesRequest(_action: FetchTilesRequestAction) {
  try {
    const tiles: Record<string, AtlasTile> = yield call(() => Atlas.fetchTiles(ATLAS_SERVER_URL + '/v1/tiles'))
    yield put(fetchTilesSuccess(tiles))
  } catch (error) {
    yield put(fetchTilesFailure(isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
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
        rentalStatus: [RentalStatus.OPEN, RentalStatus.CANCELLED, RentalStatus.EXECUTED]
      }
    })
  )
}
