import { all, takeEvery, put } from 'redux-saga/effects'
import { toastSaga as baseToastSaga } from 'decentraland-dapps/dist/modules/toast/sagas'
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { getChainConfiguration } from 'decentraland-dapps/dist/lib/chainConfiguration'
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
import {
  GrantTokenFailureAction,
  GRANT_TOKEN_FAILURE,
  RevokeTokenFailureAction,
  REVOKE_TOKEN_FAILURE
} from 'decentraland-dapps/dist/modules/authorization/actions'

export function* toastSaga() {
  yield all([baseToastSaga(), customToastSaga()])
}

function* customToastSaga() {
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
  const { nft, error } = action.payload

  if (nft.network === Network.MATIC && !isUserDeniedSignature(error)) {
    yield put(showToast(getMetaTransactionFailureToast()))
  }
}

function* handleAuthorizationMetaTransactionFailure(
  action: GrantTokenFailureAction | RevokeTokenFailureAction
) {
  const { authorization, error } = action.payload

  const { network } = getChainConfiguration(authorization.chainId)
  if (network === Network.MATIC && !isUserDeniedSignature(error)) {
    yield put(showToast(getMetaTransactionFailureToast()))
  }
}

function isUserDeniedSignature(message: string) {
  return message.indexOf('User denied message signature') !== -1
}
