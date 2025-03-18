import { call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { connectWalletSuccess } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { config } from '../../config'
import { fetchCreditsRequest, fetchCreditsSuccess, fetchCreditsFailure } from './actions'
import { creditsSaga } from './sagas'
import { CreditsResponse } from './types'

describe('Credits sagas', () => {
  const address = '0x123'
  const wallet = { address } as Wallet
  const credits: CreditsResponse = {
    credits: [],
    totalCredits: 0
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when handling the fetch credits request action', () => {
    describe('when the request is successful', () => {
      it('should put a fetch credits success action with the credits', () => {
        const response = { ok: true, json: () => credits }

        return expectSaga(creditsSaga)
          .provide([[call(fetch, `${config.get('CREDITS_SERVER_URL')}/users/${address}/credits`), response]])
          .put(fetchCreditsSuccess(address, credits))
          .dispatch(fetchCreditsRequest(address))
          .silentRun()
      })
    })

    describe('when the request fails', () => {
      it('should put a fetch credits failure action with the error', () => {
        const error = new Error('Failed to fetch credits')

        return expectSaga(creditsSaga)
          .provide([[call(fetch, `${config.get('CREDITS_SERVER_URL')}/users/${address}/credits`), throwError(error)]])
          .put(fetchCreditsFailure(address, error.message))
          .dispatch(fetchCreditsRequest(address))
          .silentRun()
      })

      it('should put a fetch credits failure action with an unknown error if the error is not a message', () => {
        return expectSaga(creditsSaga)
          .provide([[call(fetch, `${config.get('CREDITS_SERVER_URL')}/users/${address}/credits`), throwError(null)]])
          .put(fetchCreditsFailure(address, t('global.unknown_error')))
          .dispatch(fetchCreditsRequest(address))
          .silentRun()
      })
    })
  })

  describe('when handling the connect wallet success action', () => {
    it('should put a fetch credits request action with the wallet address', () => {
      return expectSaga(creditsSaga).put(fetchCreditsRequest(address)).dispatch(connectWalletSuccess(wallet)).silentRun()
    })
  })
})
