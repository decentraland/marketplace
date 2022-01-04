import { Account, AccountFilters, Network } from '@dcl/schemas'
import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { accountAPI } from '../vendor/decentraland'
import { AccountResponse } from '../vendor/decentraland/account/types'
import {
  fetchAccountMetricsFailure,
  fetchAccountMetricsRequest,
  fetchAccountMetricsSuccess
} from './actions'
import { accountSaga } from './sagas'

let account: Account
let filters: AccountFilters
let ethereumFilters: AccountFilters
let maticFilters: AccountFilters

beforeEach(() => {
  account = {
    id: 'address',
    address: 'address',
    earned: '0',
    purchases: 0,
    royalties: '0',
    sales: 0,
    spent: '0'
  }

  filters = {
    address: 'address'
  }

  ethereumFilters = {
    ...filters,
    network: Network.ETHEREUM
  }

  maticFilters = {
    ...filters,
    network: Network.MATIC
  }
})

describe('when handling the request to fetch account metrics', () => {
  describe('when a call to the accountApi fails', () => {
    const error = 'request failed with error'

    describe('when the call with ETHEREUM as network fails', () => {
      it('should signal that the request has failed with the request error', () => {
        return expectSaga(accountSaga)
          .provide([
            [
              call([accountAPI, accountAPI.fetch], ethereumFilters),
              Promise.reject(new Error(error))
            ],
            [
              call([accountAPI, accountAPI.fetch], maticFilters),
              {
                data: [account],
                total: 10
              } as AccountResponse
            ]
          ])
          .put(fetchAccountMetricsFailure(filters, error))
          .dispatch(fetchAccountMetricsRequest(filters))
          .silentRun()
      })
    })

    describe('when the call with MATIC as network fails', () => {
      it('should signal that the request has failed with the request error', () => {
        return expectSaga(accountSaga)
          .provide([
            [
              call([accountAPI, accountAPI.fetch], ethereumFilters),
              {
                data: [account],
                total: 10
              } as AccountResponse
            ],
            [
              call([accountAPI, accountAPI.fetch], maticFilters),
              Promise.reject(new Error(error))
            ]
          ])
          .put(fetchAccountMetricsFailure(filters, error))
          .dispatch(fetchAccountMetricsRequest(filters))
          .silentRun()
      })
    })
  })

  describe('when none of the requests fail', () => {
    it('should signal the success with the account metrics by network', () => {
      const account1: Account = { ...account, earned: '200' }
      const account2: Account = { ...account, earned: '100' }

      return expectSaga(accountSaga)
        .provide([
          [
            call([accountAPI, accountAPI.fetch], {
              ...filters,
              network: Network.ETHEREUM
            }),
            {
              data: [account1],
              total: 10
            } as AccountResponse
          ],
          [
            call([accountAPI, accountAPI.fetch], {
              ...filters,
              network: Network.MATIC
            }),
            {
              data: [account2],
              total: 10
            } as AccountResponse
          ]
        ])
        .put(
          fetchAccountMetricsSuccess(filters, {
            [Network.ETHEREUM]: [account1],
            [Network.MATIC]: [account2]
          })
        )
        .dispatch(fetchAccountMetricsRequest(filters))
        .silentRun()
    })
  })
})
