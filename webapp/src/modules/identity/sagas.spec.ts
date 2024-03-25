import { call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { AuthIdentity } from '@dcl/crypto'
import { localStorageClearIdentity, localStorageGetIdentity } from '@dcl/single-sign-on-client'
import { connectWalletSuccess, disconnectWallet } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { generateIdentitySuccess } from './actions'
import { identitySaga, setAuxAddress } from './sagas'

jest.mock('@dcl/single-sign-on-client', () => {
  return {
    localStorageClearIdentity: jest.fn(),
    localStorageGetIdentity: jest.fn(),
    localStorageStoreIdentity: jest.fn()
  }
})

beforeEach(() => {
  jest.resetAllMocks()

  setAuxAddress(null)
})

describe('when handling the wallet connection success', () => {
  let wallet: Wallet
  let windowLocation: Location

  beforeEach(() => {
    wallet = {
      address: '0x0'
    } as Wallet
  })

  describe("and there's no identity", () => {
    beforeEach(() => {
      windowLocation = window.location
      delete (window as { location?: unknown }).location
      window.location = {
        replace: jest.fn()
      } as any as Location
    })
    afterEach(() => {
      window.location = windowLocation
    })
    it('should redirect to auth dapp', async () => {
      await expectSaga(identitySaga)
        .provide([[call(localStorageGetIdentity, wallet.address), null]])
        .dispatch(connectWalletSuccess(wallet))
        .run({ silenceTimeout: true })
      expect(window.location.replace).toHaveBeenCalled()
    })
  })

  describe("and there's an identity", () => {
    let identity: AuthIdentity

    beforeEach(() => {
      identity = {} as any
      ;(localStorageGetIdentity as jest.Mock).mockReturnValue(identity)
    })
    it('should put an action to store the identity', () => {
      return expectSaga(identitySaga)
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

    it('should call the sso client to clear the identity in the local storage', async () => {
      await expectSaga(identitySaga).dispatch(disconnectWallet()).run({ silenceTimeout: true })

      expect(localStorageClearIdentity).toHaveBeenCalledWith(address)
    })
  })

  describe('when the auxiliary address is not set', () => {
    beforeEach(() => {
      setAuxAddress(null)
    })

    it('should not call the sso client to clear the identity', async () => {
      await expectSaga(identitySaga).dispatch(disconnectWallet()).run({ silenceTimeout: true })

      expect(localStorageClearIdentity).not.toHaveBeenCalled()
    })
  })
})
