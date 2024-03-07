import {
  ConnectWalletSuccessAction,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { put, race, select, take, takeEvery } from 'redux-saga/effects'
import {
  openModal,
  CloseModalAction,
  CLOSE_MODAL,
  closeModal
} from 'decentraland-dapps/dist/modules/modal/actions'
import { OpenLoginAction, OPEN_LOGIN } from './actions'
import { getAddress } from '../wallet/selectors'

function* handleOpenLoginModal(_action: OpenLoginAction) {
  const address: string = yield select(getAddress)

  if (!address) {
    yield put(openModal('LoginModal'))

    const {
      success,
      close
    }: {
      success: ConnectWalletSuccessAction
      failure: ConnectWalletSuccessAction
      close: CloseModalAction
    } = yield race({
      success: take(CONNECT_WALLET_SUCCESS),
      failure: take(CONNECT_WALLET_FAILURE),
      close: take(CLOSE_MODAL)
    })

    if (close) {
      return
    }

    if (success) {
      yield put(closeModal('LoginModal'))
    }
  }
}

export function* loginSaga() {
  yield takeEvery(OPEN_LOGIN, handleOpenLoginModal)
}
