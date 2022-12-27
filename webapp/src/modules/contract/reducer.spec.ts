import { ChainId, Network } from '@dcl/schemas'
import { Contract } from '../vendor/services'
import {
  fetchContractsFailure,
  fetchContractsRequest,
  fetchContractsSuccess,
  FETCH_CONTRACTS_REQUEST,
  upsertContracts
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

describe('when upsert contracts action is received', () => {
  describe('when the received contract already exist', () => {
    it('should update the stored contract with the received one', () => {
      const contract = {
        address: 'address',
        name: 'some name',
        chainId: ChainId.MATIC_MUMBAI
      } as Contract

      const newContract = {
        ...contract,
        name: 'some other name'
      }

      const newState = contractReducer(
        {
          loading: [],
          error: null,
          data: [contract]
        },
        upsertContracts([newContract])
      )

      expect(newState.data).toEqual([newContract])
    })
  })

  describe('when the received contract does not already exist', () => {
    it('should insert it into the store', () => {
      const newContract = {
        address: 'address',
        chainId: ChainId.MATIC_MUMBAI,
        name: 'some other name'
      } as Contract

      const newState = contractReducer(
        {
          loading: [],
          error: null,
          data: []
        },
        upsertContracts([newContract])
      )

      expect(newState.data).toEqual([newContract])
    })
  })
})
