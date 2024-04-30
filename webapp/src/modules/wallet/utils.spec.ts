import { delay, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import {
  CONNECT_WALLET_FAILURE,
  CONNECT_WALLET_SUCCESS,
  connectWalletFailure,
  connectWalletSuccess
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { WAIT_FOR_WALLET_CONNECTION_TIMEOUT, formatBalance, waitForWalletConnectionAndIdentityIfConnecting } from './utils'

describe('when formatting the balance', () => {
  describe('and the number is 0', () => {
    it('should return 0', () => {
      expect(formatBalance(0.0)).toBe('0')
    })
  })

  describe('and the number is too low', () => {
    it('should fixed the number based on the scientific notation', () => {
      expect(formatBalance(0.000000000000008588)).toBe('0.000000000000009')
    })
  })

  describe('and is near to the max amount of MANA', () => {
    it('should return the same number', () => {
      expect(formatBalance(229355146838009200000)).toBe('229355146838009200000')
    })
  })
})

describe('when waiting for the wallet to connect', () => {
  describe('and the wallet is connecting to later reject', () => {
    it('should finish waiting after the wallet finished connecting', () => {
      return expectSaga(waitForWalletConnectionAndIdentityIfConnecting)
        .provide([[select(isConnecting), true]])
        .take(CONNECT_WALLET_FAILURE)
        .dispatch(connectWalletFailure('error'))
        .run()
    })
  })

  describe('and the wallet is connecting to later resolve', () => {
    it('should finish waiting after the wallet finishes connecting', () => {
      return expectSaga(waitForWalletConnectionAndIdentityIfConnecting)
        .provide([[select(isConnecting), true]])
        .take(CONNECT_WALLET_SUCCESS)
        .dispatch(connectWalletSuccess({} as Wallet))
        .run()
    })
  })

  describe('and the wallet is not connecting', () => {
    it('should finish without waiting for the wallet to connect', () => {
      return expectSaga(waitForWalletConnectionAndIdentityIfConnecting)
        .provide([[select(isConnecting), false]])
        .run()
    })
  })

  describe('and the wallet connection times out', () => {
    it('should finish waiting after the timeout', () => {
      return expectSaga(waitForWalletConnectionAndIdentityIfConnecting)
        .provide([
          [select(isConnecting), true],
          [delay(WAIT_FOR_WALLET_CONNECTION_TIMEOUT), void 0]
        ])
        .run()
    })
  })
})
