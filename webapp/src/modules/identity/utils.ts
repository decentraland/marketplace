import { select, put, race, take, call } from 'redux-saga/effects'
import { getCurrentIdentity } from './selectors'
import {
  generateIdentityRequest,
  GenerateIdentitySuccessAction,
  GENERATE_IDENTITY_FAILURE,
  GENERATE_IDENTITY_SUCCESS
} from './actions'
import { getAddress } from '../wallet/selectors'
import {
  connectWalletRequest,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  ConnectWalletSuccessAction
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { AuthIdentity } from 'dcl-crypto'
import { config } from '../../config'

const ONE_MONTH_IN_MINUTES = 31 * 24 * 60

export const IDENTITY_EXPIRATION_IN_MINUTES = (() => {
  const expiration = config.get('IDENTITY_EXPIRATION_MINUTES')

  if (!expiration) {
    return ONE_MONTH_IN_MINUTES
  }

  return Number(expiration)
})()

const IDENTITY_ERROR = 'Could not get identity'

// Helper that always yields a valid identity
// If the wallet is not connected it will try to connect
// If the identity is invalid or has not been generated. It will try to generate it
export function* getIdentity(): Generator<any, AuthIdentity, any> {
  const address: ReturnType<typeof getAddress> = yield select(getAddress)

  if (!address) {
    yield put(connectWalletRequest())

    const { success }: { success: ConnectWalletSuccessAction } = yield race({
      success: take(CONNECT_WALLET_SUCCESS),
      failure: take(CONNECT_WALLET_FAILURE)
    })

    if (success) {
      return yield call(getIdentity)
    }

    throw new Error(IDENTITY_ERROR)
  }

  const identity: ReturnType<typeof getCurrentIdentity> = yield select(
    getCurrentIdentity
  )

  if (identity) {
    return identity
  }

  yield put(generateIdentityRequest(address))

  const { success }: { success: GenerateIdentitySuccessAction } = yield race({
    success: take(GENERATE_IDENTITY_SUCCESS),
    failure: take(GENERATE_IDENTITY_FAILURE)
  })

  if (success) {
    return yield call(getIdentity)
  } else {
    throw new Error(IDENTITY_ERROR)
  }
}

// Return if an identity is valid according to its expiration
// or its nullity
export function isValid(identity?: AuthIdentity | null) {
  return !!identity && Date.now() < +new Date(identity.expiration)
}
