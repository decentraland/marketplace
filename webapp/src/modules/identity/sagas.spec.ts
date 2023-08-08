import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  connectWalletSuccess,
  disconnectWallet
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { getIdentity, clearIdentity } from '@dcl/single-sign-on-client'
import { identitySaga, setAuxAddress } from './sagas'
import { generateIdentityRequest, generateIdentitySuccess } from './actions'

jest.mock('@dcl/single-sign-on-client', () => {
  return {
    getIdentity: jest.fn(),
    clearIdentity: jest.fn()
  }
})

beforeEach(() => {
  jest.resetAllMocks()

  setAuxAddress(null)
})

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
        .provide([[call(getIdentity, wallet.address), null]])
        .put(generateIdentityRequest(wallet.address))
        .dispatch(connectWalletSuccess(wallet))
        .run({ silenceTimeout: true })
    })
  })

  describe("and there's an identity", () => {
    it('should put an action to store the identity', () => {
      const identity = {} as any

      return expectSaga(identitySaga)
        .provide([[call(getIdentity, wallet.address), identity]])
        .put(generateIdentitySuccess(wallet.address, identity))
        .dispatch(connectWalletSuccess(wallet))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the disconnect', () => {
  describe('when the auxiliary address is set', () => {
    const address = '0xSomeAddress'

    beforeEach(() => {
      setAuxAddress(address)
    })

    it('should call the sso client to clear the identity', async () => {
      await expectSaga(identitySaga)
        .dispatch(disconnectWallet())
        .run({ silenceTimeout: true })

      expect(clearIdentity).toHaveBeenCalledWith(address)
    })
  })

  describe('when the auxiliary address is not set', () => {
    beforeEach(() => {
      setAuxAddress(null)
    })

    it('should not call the sso client to clear the identity', async () => {
      await expectSaga(identitySaga)
        .dispatch(disconnectWallet())
        .run({ silenceTimeout: true })

      expect(clearIdentity).not.toHaveBeenCalled()
    })
  })
})
