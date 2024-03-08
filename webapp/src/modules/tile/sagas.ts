import { takeEvery, call, put } from 'redux-saga/effects'
import { RentalStatus } from '@dcl/schemas'
import { AxiosResponse } from 'axios'
import { atlasAPI } from '../../modules/vendor/decentraland'
import { FETCH_TILES_REQUEST, FetchTilesRequestAction, fetchTilesSuccess, fetchTilesFailure } from './actions'
import { ConnectWalletSuccessAction, CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { fetchNFTsRequest } from '../nft/actions'
import { VendorName } from '../vendor'
import { View } from '../ui/types'
import { AtlasTile } from 'decentraland-ui'

export function* tileSaga() {
  yield takeEvery(FETCH_TILES_REQUEST, handleFetchTilesRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleFetchTilesRequest(_action: FetchTilesRequestAction) {
  try {
    const response: AxiosResponse<{
      data: Record<string, AtlasTile>
    }> = yield call(atlasAPI.fetchTiles)
    const tiles = response.data.data
    const lastModified = response.headers['last-modified']
    yield put(fetchTilesSuccess(tiles, new Date(lastModified)))
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
