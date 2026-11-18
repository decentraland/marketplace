import { call, delay, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { dynamic } from 'redux-saga-test-plan/providers'
import { ChainId } from '@dcl/schemas'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import {
  CONNECT_WALLET_FAILURE,
  CONNECT_WALLET_SUCCESS,
  SWITCH_NETWORK_REQUEST,
  connectWalletFailure,
  connectWalletSuccess,
  switchNetworkFailure,
  switchNetworkRequest,
  switchNetworkSuccess
} from 'decentraland-dapps/dist/modules/wallet/actions'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Provider, Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { getProviderChainId } from 'decentraland-dapps/dist/modules/wallet/utils'
import {
  WAIT_FOR_WALLET_CONNECTION_TIMEOUT,
  formatBalance,
  switchToChainIfNeeded,
  waitForWalletConnectionAndIdentityIfConnecting
} from './utils'

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

describe('when switching the wallet to a chain if needed', () => {
  let chainId: ChainId

  beforeEach(() => {
    chainId = ChainId.ETHEREUM_MAINNET
  })

  describe('and there is no connected provider', () => {
    it('should throw an error asking for a connected provider', () => {
      return expectSaga(switchToChainIfNeeded, chainId)
        .provide([[call(getConnectedProvider), null]])
        .throws(new Error('A connected provider is required to switch the network'))
        .run()
    })
  })

  describe('and there is a connected provider', () => {
    let provider: Provider

    beforeEach(() => {
      provider = {} as Provider
    })

    describe('and it is connected to the requested chain', () => {
      it('should not ask the wallet to switch the network', () => {
        return expectSaga(switchToChainIfNeeded, chainId)
          .provide([
            [call(getConnectedProvider), provider],
            [call(getProviderChainId, provider), ChainId.ETHEREUM_MAINNET]
          ])
          .not.put.actionType(SWITCH_NETWORK_REQUEST)
          .run()
      })
    })

    describe('and it is connected to another chain', () => {
      let connectedChainIds: ChainId[]

      describe('and the wallet switches to the requested chain', () => {
        beforeEach(() => {
          connectedChainIds = [ChainId.MATIC_MAINNET, ChainId.ETHEREUM_MAINNET]
        })

        it('should ask the wallet to switch to the requested chain and finish once it is on it', () => {
          return expectSaga(switchToChainIfNeeded, chainId)
            .provide([
              [call(getConnectedProvider), provider],
              [call(getProviderChainId, provider), dynamic(() => connectedChainIds.shift())]
            ])
            .put(switchNetworkRequest(chainId))
            .dispatch(switchNetworkSuccess(chainId))
            .returns(undefined)
            .run()
        })
      })

      describe('and the wallet fails to switch the network', () => {
        let switchError: string

        beforeEach(() => {
          connectedChainIds = [ChainId.MATIC_MAINNET]
          switchError = 'Error switching network: User rejected the request.'
        })

        it('should throw the switch error so the operation is not sent from the wrong chain', () => {
          return expectSaga(switchToChainIfNeeded, chainId)
            .provide([
              [call(getConnectedProvider), provider],
              [call(getProviderChainId, provider), dynamic(() => connectedChainIds.shift())]
            ])
            .dispatch(switchNetworkFailure(chainId, switchError))
            .throws(new Error(switchError))
            .run()
        })
      })

      describe('and a switch to another chain finishes while the wallet is switching', () => {
        beforeEach(() => {
          connectedChainIds = [ChainId.MATIC_MAINNET, ChainId.ETHEREUM_MAINNET]
        })

        it('should ignore the unrelated result and finish once the wallet is on the requested chain', () => {
          return expectSaga(switchToChainIfNeeded, chainId)
            .provide([
              [call(getConnectedProvider), provider],
              [call(getProviderChainId, provider), dynamic(() => connectedChainIds.shift())]
            ])
            .dispatch(switchNetworkFailure(ChainId.MATIC_MAINNET, 'anUnrelatedError'))
            .dispatch(switchNetworkSuccess(chainId))
            .returns(undefined)
            .run()
        })
      })

      describe('and the wallet reports the switch as successful but stays on the other chain', () => {
        beforeEach(() => {
          connectedChainIds = [ChainId.MATIC_MAINNET, ChainId.MATIC_MAINNET]
        })

        it('should throw an error saying the wallet did not switch to the requested chain', () => {
          return expectSaga(switchToChainIfNeeded, chainId)
            .provide([
              [call(getConnectedProvider), provider],
              [call(getProviderChainId, provider), dynamic(() => connectedChainIds.shift())]
            ])
            .dispatch(switchNetworkSuccess(chainId))
            .throws(new Error(`The wallet did not switch to the chain ${chainId}`))
            .run()
        })
      })
    })
  })
})
