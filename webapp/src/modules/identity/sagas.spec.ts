import { expectSaga } from 'redux-saga-test-plan'
import { put } from 'redux-saga-test-plan/matchers'
import { select } from 'redux-saga/effects'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { connectWalletSuccess } from 'decentraland-dapps/dist/modules/wallet/actions'
import { getCurrentIdentity } from './selectors'
import { identitySaga } from './sagas'
import { generateIdentityRequest } from './actions'

describe('when handling the wallet connection success', () => {
  let wallet: Wallet
  beforeEach(() => {
    wallet = {
      address: '0x0'
    } as Wallet
  })

  describe("and there's no identity", () => {
    it('should put an action to generate the identity', () => {
      return expectSaga(identitySaga)
        .provide([
          [select(getCurrentIdentity), null],
          [put(generateIdentityRequest(wallet.address)), undefined]
        ])
        .put(generateIdentityRequest(wallet.address))
        .dispatch(connectWalletSuccess(wallet))
        .run({ silenceTimeout: true })
    })
  })

  describe("and there's an identity", () => {
    it('should not put an action to generate the identity', () => {
      return expectSaga(identitySaga)
        .provide([[select(getCurrentIdentity), {}]])
        .not.put(generateIdentityRequest(wallet.address))
        .dispatch(connectWalletSuccess(wallet))
        .run({ silenceTimeout: true })
    })
  })
})
