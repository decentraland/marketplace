import {
  takeLatest,
  put,
  call
} from 'redux-saga/effects'
import { Eth } from 'web3x/eth'
import { Personal } from 'web3x/personal'
import { Address } from 'web3x/address'
import { bufferToHex } from 'web3x/utils'
import { Account } from 'web3x/account'
import { Authenticator, AuthIdentity } from 'dcl-crypto'
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
    const eth: Eth = yield call(getEth)
    const account = Account.create()

    const payload = {
      address: account.address.toString(),
      publicKey: bufferToHex(account.publicKey),
      privateKey: bufferToHex(account.privateKey)
    }

    const personal = new Personal(eth.provider)

    const identity: AuthIdentity = yield Authenticator.initializeAuthChain(
      address,
      payload,
      IDENTITY_EXPIRATION_IN_MINUTES,
      message => personal.sign(message, Address.fromString(address), '')
    )

    yield put(generateIdentitySuccess(address, identity))
  } catch (error) {
    yield put(generateIdentityFailure(address, error))
  }
}
