import { takeLatest, put, call } from 'redux-saga/effects'
import { providers, utils, Wallet } from 'ethers'
import { Authenticator, AuthIdentity } from '@dcl/crypto'
import { getEth } from '../wallet/utils'

import {
  GENERATE_IDENTITY_REQUEST,
  GenerateIdentityRequestAction,
  generateIdentityFailure,
  generateIdentitySuccess
} from './actions'
import { IDENTITY_EXPIRATION_IN_MINUTES } from './utils'

export function* identitySaga() {
  yield takeLatest(GENERATE_IDENTITY_REQUEST, handleGenerateIdentityRequest)
}

function* handleGenerateIdentityRequest(action: GenerateIdentityRequestAction) {
  const address = action.payload.address.toLowerCase()

  try {
    const eth: providers.Web3Provider = yield call(getEth)
    const account = Wallet.createRandom()

    const payload = {
      address: account.address.toString(),
      publicKey: utils.hexlify(account.publicKey),
      privateKey: utils.hexlify(account.privateKey)
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
    yield put(generateIdentityFailure(address, error))
  }
}
