import { expectSaga } from 'redux-saga-test-plan'
import { services as decentraland } from '../vendor/decentraland'
import { Contract } from '../vendor/services'
import {
  fetchContractsFailure,
  fetchContractsRequest,
  fetchContractsSuccess
} from './actions'
import { contractSaga } from './sagas'

describe.only('when handling the fetch contracts request', () => {
  let mockGetContracts: jest.SpyInstance<Promise<Contract[]>>

  afterEach(() => {
    mockGetContracts.mockClear()
  })

  describe('when the api call is successful', () => {
    it('should put a success action with contracts', () => {
      mockGetContracts = jest
        .spyOn(decentraland.ContractService.prototype, 'getContracts')
        .mockResolvedValueOnce([])

      return expectSaga(contractSaga)
        .put(fetchContractsSuccess([]))
        .dispatch(fetchContractsRequest())
        .silentRun()
    })
  })

  describe('when the api call fails', () => {
    it('should put a failure action with the error', () => {
      mockGetContracts = jest
        .spyOn(decentraland.ContractService.prototype, 'getContracts')
        .mockRejectedValueOnce(new Error('some error'))
      return expectSaga(contractSaga)
        .put(fetchContractsFailure('some error'))
        .dispatch(fetchContractsRequest())
        .silentRun()
    })
  })
})
