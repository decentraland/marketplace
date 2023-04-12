import { takeLatest, put, call, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { Authenticator, AuthIdentity } from '@dcl/crypto'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CONNECT_WALLET_SUCCESS } from 'decentraland-dapps/dist/modules/wallet/actions'
import { ConnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet/actions'
import { isErrorWithMessage } from '../../lib/error'
import { getEth } from '../wallet/utils'

import {
  GENERATE_IDENTITY_REQUEST,
  GenerateIdentityRequestAction,
  generateIdentityFailure,
  generateIdentityRequest,
  generateIdentitySuccess
} from './actions'
import { IDENTITY_EXPIRATION_IN_MINUTES } from './utils'
import { getCurrentIdentity } from './selectors'

export function* identitySaga() {
  yield takeLatest(GENERATE_IDENTITY_REQUEST, handleGenerateIdentityRequest)
  yield takeLatest(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
}

function* handleGenerateIdentityRequest(action: GenerateIdentityRequestAction) {
  const address = action.payload.address.toLowerCase()

  try {
    const eth: ethers.providers.Web3Provider = yield call(getEth)
    const account = ethers.Wallet.createRandom()

    const payload = {
      address: account.address.toString(),
      publicKey: ethers.utils.hexlify(account.publicKey),
      privateKey: ethers.utils.hexlify(account.privateKey)
    }

    const signer = eth.getSigner()

    const identity: AuthIdentity = yield Authenticator.initializeAuthChain(
      address,
      payload,
      IDENTITY_EXPIRATION_IN_MINUTES,
      message => signer.signMessage(message)
    )

    yield put(generateIdentitySuccess(address, identity))
  } catch (error) {
    yield put(
      generateIdentityFailure(
        address,
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  const identity: AuthIdentity = yield select(getCurrentIdentity)
  if (!identity) {
    // Generate a new identity
    yield put(generateIdentityRequest(action.payload.wallet.address))
  }
}
