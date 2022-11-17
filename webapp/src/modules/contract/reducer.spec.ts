import { ChainId, Network } from '@dcl/schemas'
import { Contract } from '../vendor/services'
import {
  fetchContractsFailure,
  fetchContractsRequest,
  fetchContractsSuccess,
  FETCH_CONTRACTS_REQUEST
} from './actions'
import { contractReducer } from './reducer'
import { INITIAL_STATE } from './reducer'

describe('when fetch contract request action is received', () => {
  it('should add a loading state action to the loading state array', () => {
    const newState = contractReducer(INITIAL_STATE, fetchContractsRequest())
    expect(newState.loading.length).toBe(1)
    expect(newState.loading[0].type).toBe(FETCH_CONTRACTS_REQUEST)
  })
})

describe('when fetch contract success action is received', () => {
  it('should update data, set error to null remove the request loading state', () => {
    const contractSample = {
      label: '',
      category: null,
      vendor: null,
      name: '',
      address: '',
      network: Network.MATIC,
      chainId: ChainId.MATIC_MAINNET
    }
    const newState = contractReducer(
      {
        loading: [{ type: FETCH_CONTRACTS_REQUEST }],
        error: 'some error',
        data: []
      },
      fetchContractsSuccess([contractSample] as Contract[])
    )
    expect(newState.loading.length).toBe(0)
    expect(newState.data).toStrictEqual([contractSample])
    expect(newState.error).toBeNull()
  })
})

describe('when fetch contract failure action is received', () => {
  it('should update the error message and remove the request loading state', () => {
    const newState = contractReducer(
      {
        loading: [{ type: FETCH_CONTRACTS_REQUEST }],
        error: 'some error',
        data: []
      },
      fetchContractsFailure('some other error')
    )
    expect(newState.loading.length).toBe(0)
    expect(newState.error).toBe('some other error')
  })
})
