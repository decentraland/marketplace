import { all, takeEvery, put } from 'redux-saga/effects'
import { toastSaga as baseToastSaga } from 'decentraland-dapps/dist/modules/toast/sagas'
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { getMetaTransactionFailureToast } from './toasts'
import { TransferNFTFailureAction, TRANSFER_NFT_FAILURE } from '../nft/actions'
import { Network } from '@dcl/schemas'
import {
  CancelOrderFailureAction,
  CANCEL_ORDER_FAILURE,
  CreateOrderFailureAction,
  CREATE_ORDER_FAILURE,
  ExecuteOrderFailureAction,
  EXECUTE_ORDER_FAILURE
} from '../order/actions'

export function* toastSaga() {
  yield all([baseToastSaga(), customToastSaga()])
}

function* customToastSaga() {
  yield takeEvery(TRANSFER_NFT_FAILURE, handleNFTMetaTransactionFailure)
  yield takeEvery(CREATE_ORDER_FAILURE, handleNFTMetaTransactionFailure)
  yield takeEvery(EXECUTE_ORDER_FAILURE, handleNFTMetaTransactionFailure)
  yield takeEvery(CANCEL_ORDER_FAILURE, handleNFTMetaTransactionFailure)
}

function* handleNFTMetaTransactionFailure(
  action:
    | TransferNFTFailureAction
    | CreateOrderFailureAction
    | ExecuteOrderFailureAction
    | CancelOrderFailureAction
) {
  const { nft } = action.payload

  if (nft.network === Network.MATIC) {
    yield put(showToast(getMetaTransactionFailureToast()))
  }
}
