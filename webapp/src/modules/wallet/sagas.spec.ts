import { expectSaga } from 'redux-saga-test-plan'
import { changeAccount, disconnectWallet } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { walletSaga } from './sagas'

describe.each([
  ['change account', changeAccount({} as Wallet)],
  ['disconnect wallet', disconnectWallet()]
])('when handling the %s action', (_, action) => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() }
    })
  })

  it('should refresh the page', () => {
    return expectSaga(walletSaga)
      .dispatch(action)
      .run({ silenceTimeout: true })
      .then(() => expect(window.location.reload).toHaveBeenCalled())
  })
})
