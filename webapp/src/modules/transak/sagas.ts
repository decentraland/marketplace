import { put, select, takeEvery } from 'redux-saga/effects'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Network } from '@dcl/schemas'
import { Transak } from '../../lib/transak'
import { closeAllModals } from '../modal/actions'
import { OPEN_TRANSAK, OpenTransakAction } from './actions'

export function* transakSaga() {
  yield takeEvery(OPEN_TRANSAK, handleOpenTransak)
}

function* handleOpenTransak(action: OpenTransakAction) {
  const { asset } = action.payload
  const address: string = yield select(getAddress)
  yield put(closeAllModals())
  new Transak(asset).openWidget(address, Network.MATIC)
}
