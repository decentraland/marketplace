import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  connectWalletSuccess,
  disconnectWallet
} from 'decentraland-dapps/dist/modules/wallet/actions'
import {
  getIdentity,
  clearIdentity,
  localStorageClearIdentity,
  localStorageGetIdentity
} from '@dcl/single-sign-on-client'
import { identitySaga, setAuxAddress } from './sagas'
import { generateIdentityRequest, generateIdentitySuccess } from './actions'
import { getIsAuthDappEnabled } from '../features/selectors'
import { AuthIdentity } from '@dcl/crypto'

jest.mock('@dcl/single-sign-on-client', () => {
  return {
    getIdentity: jest.fn(),
    clearIdentity: jest.fn(),
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

  describe('and the auth dapp is enabled', () => {
    describe("and there's no identity", () => {
      beforeEach(() => {
        windowLocation = window.location
        delete (window as any).location
        window.location = ({
          replace: jest.fn()
        } as any) as Location
      })
      afterEach(() => {
        window.location = windowLocation
      })
      it('should redirect to auth dapp', async () => {
        await expectSaga(identitySaga)
          .provide([
            [call(localStorageGetIdentity, wallet.address), null],
            [select(getIsAuthDappEnabled), true]
          ])
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
          .provide([[select(getIsAuthDappEnabled), true]])
          .put(generateIdentitySuccess(wallet.address, identity))
          .dispatch(connectWalletSuccess(wallet))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('and the auth dapp is not enabled', () => {
    describe("and there's no identity", () => {
      it('should put an action to generate the identity', () => {
        return expectSaga(identitySaga)
          .provide([
            [call(getIdentity, wallet.address), null],
            [select(getIsAuthDappEnabled), false]
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
            [call(getIdentity, wallet.address), identity],
            [select(getIsAuthDappEnabled), false]
          ])
          .put(generateIdentitySuccess(wallet.address, identity))
          .dispatch(connectWalletSuccess(wallet))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the disconnect', () => {
  describe('when the auxiliary address is set', () => {
    const address = '0xSomeAddress'

    beforeEach(() => {
      setAuxAddress(address)
    })

    describe('and the auth dapp is enabled', () => {
      it('should call the sso client to clear the identity in the local storage', async () => {
        await expectSaga(identitySaga)
          .provide([[select(getIsAuthDappEnabled), true]])
          .dispatch(disconnectWallet())
          .run({ silenceTimeout: true })

        expect(localStorageClearIdentity).toHaveBeenCalledWith(address)
      })
    })

    describe('and the auth dapp is not enabled', () => {
      it('should call the sso client to clear the identity', async () => {
        await expectSaga(identitySaga)
          .provide([[select(getIsAuthDappEnabled), false]])
          .dispatch(disconnectWallet())
          .run({ silenceTimeout: true })

        expect(clearIdentity).toHaveBeenCalledWith(address)
      })
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
