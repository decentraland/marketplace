import { all, takeEvery, put } from 'redux-saga/effects'
import { Network } from '@dcl/schemas'
import { ErrorCode } from 'decentraland-transactions'
import { toastSaga as baseToastSaga } from 'decentraland-dapps/dist/modules/toast/sagas'
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import {
  GrantTokenFailureAction,
  GRANT_TOKEN_FAILURE,
  RevokeTokenFailureAction,
  REVOKE_TOKEN_FAILURE
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { getChainConfiguration } from 'decentraland-dapps/dist/lib/chainConfiguration'
import { TransferNFTFailureAction, TRANSFER_NFT_FAILURE } from '../nft/actions'
import {
  CancelOrderFailureAction,
  CANCEL_ORDER_FAILURE,
  CreateOrderFailureAction,
  CREATE_ORDER_FAILURE,
  ExecuteOrderFailureAction,
  EXECUTE_ORDER_FAILURE
} from '../order/actions'
import {
  getMetaTransactionFailureToast,
  getContractAccountFailureToast,
  getStoreUpdateSucessToast
} from './toasts'
import {
  isContractAccountError,
  isUserDeniedSignatureError
} from '../transaction/utils'
import { UPDATE_STORE_SUCCESS } from '../store/actions'

export function* toastSaga() {
  yield all([baseToastSaga(), customToastSaga()])
}

function* customToastSaga() {
  yield all([successToastSagas(), failureToastSagas()])
}

function* successToastSagas() {
  yield takeEvery(UPDATE_STORE_SUCCESS, handleStoreUpdateSuccess)
}

function* failureToastSagas() {
  yield takeEvery(TRANSFER_NFT_FAILURE, handleNFTMetaTransactionFailure)
  yield takeEvery(CREATE_ORDER_FAILURE, handleNFTMetaTransactionFailure)
  yield takeEvery(EXECUTE_ORDER_FAILURE, handleNFTMetaTransactionFailure)
  yield takeEvery(CANCEL_ORDER_FAILURE, handleNFTMetaTransactionFailure)

  yield takeEvery(
    GRANT_TOKEN_FAILURE,
    handleAuthorizationMetaTransactionFailure
  )
  yield takeEvery(
    REVOKE_TOKEN_FAILURE,
    handleAuthorizationMetaTransactionFailure
  )
}

function* handleNFTMetaTransactionFailure(
  action:
    | TransferNFTFailureAction
    | CreateOrderFailureAction
    | ExecuteOrderFailureAction
    | CancelOrderFailureAction
) {
  const { nft, errorCode } = action.payload

  if (nft.network === Network.MATIC) {
    switch (errorCode) {
      case ErrorCode.USER_DENIED:
        // do nothing
        break
      case ErrorCode.CONTRACT_ACCOUNT:
        yield put(showToast(getContractAccountFailureToast()))
        break
      default:
        yield put(showToast(getMetaTransactionFailureToast()))
    }
  }
}

function* handleAuthorizationMetaTransactionFailure(
  action: GrantTokenFailureAction | RevokeTokenFailureAction
) {
  const { authorization, error } = action.payload

  const { network } = getChainConfiguration(authorization.chainId)

  if (network === Network.MATIC && !isUserDeniedSignatureError(error)) {
    if (isContractAccountError(error)) {
      yield put(showToast(getContractAccountFailureToast()))
    } else {
      yield put(showToast(getMetaTransactionFailureToast()))
    }
  }
}

function* handleStoreUpdateSuccess() {
  yield put(showToast(getStoreUpdateSucessToast()))
}
