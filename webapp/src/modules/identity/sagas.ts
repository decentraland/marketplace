import { takeLatest, put, call } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { Authenticator, AuthIdentity } from '@dcl/crypto'
import { localStorageGetIdentity, localStorageClearIdentity, localStorageStoreIdentity } from '@dcl/single-sign-on-client'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  CONNECT_WALLET_SUCCESS,
  DISCONNECT_WALLET,
  DisconnectWalletAction,
  ConnectWalletSuccessAction
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { isErrorWithMessage } from '../../lib/error'
import { config } from '../../config'
import { getEth } from '../wallet/utils'

import { GENERATE_IDENTITY_REQUEST, GenerateIdentityRequestAction, generateIdentityFailure, generateIdentitySuccess } from './actions'
import { IDENTITY_EXPIRATION_IN_MINUTES } from './utils'

export function* identitySaga() {
  yield takeLatest(GENERATE_IDENTITY_REQUEST, handleGenerateIdentityRequest)
  yield takeLatest(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeLatest(DISCONNECT_WALLET, handleDisconnect)
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

    const identity: AuthIdentity = yield Authenticator.initializeAuthChain(address, payload, IDENTITY_EXPIRATION_IN_MINUTES, message =>
      signer.signMessage(message)
    )

    // Stores the identity into the SSO iframe.
    yield call(localStorageStoreIdentity, address, identity)

    yield put(generateIdentitySuccess(address, identity))
  } catch (error) {
    yield put(generateIdentityFailure(address, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

// Persist the address of the connected wallet.
// This is a workaround for when the user disconnects as there is no selector that provides the address at that point
let auxAddress: string | null = null

export function setAuxAddress(address: string | null) {
  auxAddress = address
}

function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
  const address = action.payload.wallet.address

  yield call(setAuxAddress, address)

  const identity: AuthIdentity | null = localStorageGetIdentity(address)

  if (identity) {
    yield put(generateIdentitySuccess(address, identity))
  } else {
    window.location.replace(`${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(window.location.href)}`)
  }
}

function* handleDisconnect(_action: DisconnectWalletAction) {
  if (auxAddress) {
    localStorageClearIdentity(auxAddress)
  }
}
