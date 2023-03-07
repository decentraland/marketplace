import { Network } from '@dcl/schemas'
import {
  fetchAccountMetricsFailure,
  fetchAccountMetricsRequest,
  fetchAccountMetricsSuccess,
  fetchCreatorsAccountFailure,
  fetchCreatorsAccountRequest,
  fetchCreatorsAccountSuccess,
  FETCH_ACCOUNT_METRICS_REQUEST,
  FETCH_CREATORS_ACCOUNT_REQUEST
} from './actions'
import { accountReducer, AccountState } from './reducer'
import { AccountMetrics, CreatorAccount } from './types'

let state: AccountState

beforeEach(() => {
  state = {
    data: {},
    creators: { accounts: [], search: null },
    metrics: {
      [Network.ETHEREUM]: {},
      [Network.MATIC]: {}
    },
    error: null,
    loading: []
  }
})

describe('when reducing the action that signals the fetch of account metrics', () => {
  it('should return a state where the loading state has the fetch account metrics action', () => {
    const result = accountReducer(state, fetchAccountMetricsRequest({}))

    expect(result.loading.length).toEqual(1)
    expect(result.loading[0].type).toEqual(FETCH_ACCOUNT_METRICS_REQUEST)
  })
})

describe('when reducing the action that signals the successful fetch of account metrics', () => {
  let result: AccountState
  let metrics1: AccountMetrics
  let metrics2: AccountMetrics

  beforeEach(() => {
    state.loading = [{ type: FETCH_ACCOUNT_METRICS_REQUEST }]
    state.error = 'some error'

    metrics1 = {
      address: 'address',
      earned: '100',
      purchases: 100,
      royalties: '100',
      sales: 100,
      spent: '100'
    }

    metrics2 = {
      address: 'address',
      earned: '200',
      purchases: 200,
      royalties: '200',
      sales: 200,
      spent: '200'
    }

    result = accountReducer(
      state,
      fetchAccountMetricsSuccess(
        {},
        {
          [Network.ETHEREUM]: [metrics1],
          [Network.MATIC]: [metrics2]
        }
      )
    )
  })

  it('should return a state where the received account metrics are stored in the metrics state', () => {
    expect(result.metrics).toEqual({
      [Network.ETHEREUM]: {
        address: metrics1
      },
      [Network.MATIC]: {
        address: metrics2
      }
    })
  })

  it('should return a state where the error is set to null', () => {
    expect(result.error).toEqual(null)
  })

  it('should return a state where the request for fetching the metrics is not in the loading state anymore', () => {
    expect(result.loading).toEqual([])
  })
})

describe('when reducing the action that signals the failed fetch of account metrics', () => {
  let result: AccountState

  beforeEach(() => {
    state.loading = [{ type: FETCH_ACCOUNT_METRICS_REQUEST }]
    result = accountReducer(state, fetchAccountMetricsFailure({}, 'some error'))
  })

  it('should return a state where the error is set', () => {
    expect(result.error).toEqual('some error')
  })

  it('should return a state where the request for fetching the metrics is not in the loading state anymore', () => {
    expect(result.loading).toEqual([])
  })
})

describe('when reducing the action that signals the request of the fetch of creators accounts', () => {
  it('should return a state where the loading state has the fetch creators account action', () => {
    const result = accountReducer(state, fetchCreatorsAccountRequest(''))

    expect(result.loading.length).toEqual(1)
    expect(result.loading[0].type).toEqual(FETCH_CREATORS_ACCOUNT_REQUEST)
  })
})

describe('when reducing the action that signals the successful fetch of creators accounts ', () => {
  let result: AccountState
  let search: string
  let creatorsAccounts = [{} as CreatorAccount]

  beforeEach(() => {
    search = 'aSearchTerm'
    state.loading = [{ type: FETCH_CREATORS_ACCOUNT_REQUEST }]
    state.error = 'some error'

    result = accountReducer(
      state,
      fetchCreatorsAccountSuccess(search, creatorsAccounts)
    )
  })

  it('should return a state where the received account creators are stored in the creators state', () => {
    expect(result.creators).toEqual({ accounts: creatorsAccounts, search })
  })

  it('should return a state where the error is set to null', () => {
    expect(result.error).toEqual(null)
  })

  it('should return a state where the request for fetching the creators request is not in the loading state anymore', () => {
    expect(result.loading).toEqual([])
  })
})

describe('when reducing the action that signals the failed fetch of creators accounts', () => {
  let result: AccountState
  let search: string

  beforeEach(() => {
    search = 'aSearchTerm'
    state.loading = [{ type: FETCH_CREATORS_ACCOUNT_REQUEST }]
    result = accountReducer(
      state,
      fetchCreatorsAccountFailure(search, 'some error')
    )
  })

  it('should return a state where the error is set', () => {
    expect(result.error).toEqual('some error')
  })

  it('should return a state where the request for fetching the creators request is not in the loading state anymore', () => {
    expect(result.loading).toEqual([])
  })
})
