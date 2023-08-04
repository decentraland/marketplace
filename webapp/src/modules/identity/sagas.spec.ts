import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { connectWalletSuccess } from 'decentraland-dapps/dist/modules/wallet/actions'
import * as SingleSignOn from '@dcl/single-sign-on-client'
import { identitySaga } from './sagas'
import { generateIdentityRequest, generateIdentitySuccess } from './actions'

jest.mock('@dcl/single-sign-on-client')

const SingleSignOnMock = SingleSignOn as jest.Mocked<typeof SingleSignOn>

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
          [call([SingleSignOnMock, 'getIdentity'], wallet.address), null]
        ])
        .put(generateIdentityRequest(wallet.address))
        .dispatch(connectWalletSuccess(wallet))
        .run({ silenceTimeout: true })
    })
  })

  describe("and there's an identity", () => {
    it('should put an action to store the identity', () => {
      const identity = {} as any

      return expectSaga(identitySaga)
        .provide([
          [call([SingleSignOnMock, 'getIdentity'], wallet.address), identity]
        ])
        .put(generateIdentitySuccess(wallet.address, identity))
        .dispatch(connectWalletSuccess(wallet))
        .run({ silenceTimeout: true })
    })
  })
})
