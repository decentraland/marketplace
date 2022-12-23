import { Network } from '@dcl/schemas'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { getContractNames } from '../vendor'
import { services as decentraland } from '../vendor/decentraland'
import { Contract } from '../vendor/services'
import { getAddress } from '../wallet/selectors'
import {
  fetchContractsFailure,
  fetchContractsRequest,
  fetchContractsSuccess
} from './actions'
import { contractSaga } from './sagas'
import { getContract, getContracts } from './selectors'

describe('when handling the fetch contracts request', () => {
  let mockGetContracts: jest.SpyInstance<Promise<Contract[]>>

  afterEach(() => {
    mockGetContracts.mockClear()
  })

  describe('when the api call is successful', () => {
    it('should put a success action with contracts', () => {
      mockGetContracts = jest
        .spyOn(decentraland.ContractService.prototype, 'getContracts')
        .mockResolvedValueOnce([])

      const contractNames = getContractNames()

      return expectSaga(contractSaga)
        .provide([
          [select(getContracts), []],
          [select(getAddress), '0x123'],
          [
            select(getContract, {
              name: contractNames.MARKETPLACE,
              network: Network.ETHEREUM
            }),
            {}
          ],
          [
            select(getContract, {
              name: contractNames.MARKETPLACE,
              network: Network.MATIC
            }),
            {}
          ],
          [
            select(getContract, {
              name: contractNames.LEGACY_MARKETPLACE,
              network: Network.MATIC
            }),
            {}
          ],
          [
            select(getContract, {
              name: contractNames.BIDS,
              network: Network.ETHEREUM
            }),
            {}
          ],
          [
            select(getContract, {
              name: contractNames.BIDS,
              network: Network.MATIC
            }),
            {}
          ],
          [
            select(getContract, {
              name: contractNames.MANA,
              network: Network.ETHEREUM
            }),
            {}
          ],
          [
            select(getContract, {
              name: contractNames.MANA,
              network: Network.MATIC
            }),
            {}
          ],
          [
            select(getContract, {
              name: contractNames.COLLECTION_STORE,
              network: Network.MATIC
            }),
            {}
          ],
          [
            select(getContract, {
              name: contractNames.RENTALS,
              network: Network.ETHEREUM
            }),
            {}
          ],
          [select(getAuthorizations), []]
        ])
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
