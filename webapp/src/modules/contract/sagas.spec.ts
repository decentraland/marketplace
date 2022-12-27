import { ChainId, Network } from '@dcl/schemas'
import { fetchAuthorizationsRequest } from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { getContractNames, VendorName } from '../vendor'
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

import util from 'util'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { ContractName } from 'decentraland-transactions'

util.inspect.defaultOptions.depth = null

describe('when handling the fetch contracts request', () => {
  let mockGetContracts: jest.SpyInstance<Promise<Contract[]>>

  afterEach(() => {
    mockGetContracts.mockClear()
  })

  describe('when the api call is successful', () => {
    it('should put a success action with contracts and put a request for authorizations without the one that is already stored', () => {
      const address = '0x123'

      mockGetContracts = jest
        .spyOn(decentraland.ContractService.prototype, 'getContracts')
        .mockResolvedValueOnce([])

      const contractNames = getContractNames()

      const marketplaceEthereum: Contract = {
        address: 'marketplaceEthereumAddress',
        category: null,
        chainId: ChainId.ETHEREUM_GOERLI,
        name: contractNames.MARKETPLACE,
        network: Network.ETHEREUM,
        vendor: VendorName.DECENTRALAND
      }

      const marketplaceMatic: Contract = {
        address: 'marketplaceMaticAddress',
        category: null,
        chainId: ChainId.MATIC_MUMBAI,
        name: contractNames.MARKETPLACE,
        network: Network.MATIC,
        vendor: VendorName.DECENTRALAND
      }

      const legacyMarketplace: Contract = {
        address: 'legacyMarketplaceAddress',
        category: null,
        chainId: ChainId.ETHEREUM_GOERLI,
        name: contractNames.LEGACY_MARKETPLACE,
        network: Network.ETHEREUM,
        vendor: VendorName.DECENTRALAND
      }

      const bidsEthereum: Contract = {
        address: 'bidsEthereumAddress',
        category: null,
        chainId: ChainId.ETHEREUM_GOERLI,
        name: contractNames.BIDS,
        network: Network.ETHEREUM,
        vendor: VendorName.DECENTRALAND
      }

      const bidsMatic: Contract = {
        address: 'bidsEthereumAddress',
        category: null,
        chainId: ChainId.MATIC_MUMBAI,
        name: contractNames.BIDS,
        network: Network.MATIC,
        vendor: VendorName.DECENTRALAND
      }

      const manaEthereum: Contract = {
        address: 'manaEthereumAddress',
        category: null,
        chainId: ChainId.ETHEREUM_GOERLI,
        name: contractNames.MANA,
        network: Network.ETHEREUM,
        vendor: VendorName.DECENTRALAND
      }

      const manaMatic: Contract = {
        address: 'manaMaticAddress',
        category: null,
        chainId: ChainId.MATIC_MUMBAI,
        name: contractNames.MANA,
        network: Network.MATIC,
        vendor: VendorName.DECENTRALAND
      }

      const collectionStore: Contract = {
        address: 'collectionStoreAddress',
        category: null,
        chainId: ChainId.MATIC_MUMBAI,
        name: contractNames.COLLECTION_STORE,
        network: Network.MATIC,
        vendor: VendorName.DECENTRALAND
      }

      const rentals: Contract = {
        address: 'rentalsAddress',
        category: null,
        chainId: ChainId.ETHEREUM_GOERLI,
        name: contractNames.RENTALS,
        network: Network.ETHEREUM,
        vendor: VendorName.DECENTRALAND
      }

      return expectSaga(contractSaga)
        .provide([
          [select(getContracts), []],
          [select(getAddress), address],
          [
            select(getContract, {
              name: contractNames.MARKETPLACE,
              network: Network.ETHEREUM
            }),
            marketplaceEthereum
          ],
          [
            select(getContract, {
              name: contractNames.MARKETPLACE,
              network: Network.MATIC
            }),
            marketplaceMatic
          ],
          [
            select(getContract, {
              name: contractNames.LEGACY_MARKETPLACE,
              network: Network.MATIC
            }),
            legacyMarketplace
          ],
          [
            select(getContract, {
              name: contractNames.BIDS,
              network: Network.ETHEREUM
            }),
            bidsEthereum
          ],
          [
            select(getContract, {
              name: contractNames.BIDS,
              network: Network.MATIC
            }),
            bidsMatic
          ],
          [
            select(getContract, {
              name: contractNames.MANA,
              network: Network.ETHEREUM
            }),
            manaEthereum
          ],
          [
            select(getContract, {
              name: contractNames.MANA,
              network: Network.MATIC
            }),
            manaMatic
          ],
          [
            select(getContract, {
              name: contractNames.COLLECTION_STORE,
              network: Network.MATIC
            }),
            collectionStore
          ],
          [
            select(getContract, {
              name: contractNames.RENTALS,
              network: Network.ETHEREUM
            }),
            rentals
          ],
          [
            select(getAuthorizations),
            [
              {
                address,
                authorizedAddress: rentals.address,
                contractAddress: manaEthereum.address,
                contractName: ContractName.MANAToken,
                chainId: ChainId.ETHEREUM_GOERLI,
                type: AuthorizationType.ALLOWANCE
              }
            ]
          ]
        ])
        .put(fetchContractsSuccess([]))
        .put(
          fetchAuthorizationsRequest([
            {
              address,
              authorizedAddress: marketplaceEthereum.address,
              contractAddress: manaEthereum.address,
              contractName: ContractName.MANAToken,
              chainId: ChainId.ETHEREUM_GOERLI,
              type: AuthorizationType.ALLOWANCE
            },
            {
              address,
              authorizedAddress: marketplaceMatic.address,
              contractAddress: manaMatic.address,
              contractName: ContractName.MANAToken,
              chainId: ChainId.MATIC_MUMBAI,
              type: AuthorizationType.ALLOWANCE
            },
            {
              address,
              authorizedAddress: legacyMarketplace.address,
              contractAddress: manaMatic.address,
              contractName: ContractName.MANAToken,
              chainId: ChainId.MATIC_MUMBAI,
              type: AuthorizationType.ALLOWANCE
            },
            {
              address,
              authorizedAddress: bidsEthereum.address,
              contractAddress: manaEthereum.address,
              contractName: ContractName.MANAToken,
              chainId: ChainId.ETHEREUM_GOERLI,
              type: AuthorizationType.ALLOWANCE
            },
            {
              address,
              authorizedAddress: bidsEthereum.address,
              contractAddress: manaMatic.address,
              contractName: ContractName.MANAToken,
              chainId: ChainId.MATIC_MUMBAI,
              type: AuthorizationType.ALLOWANCE
            },
            {
              address,
              authorizedAddress: collectionStore.address,
              contractAddress: manaMatic.address,
              contractName: ContractName.MANAToken,
              chainId: ChainId.MATIC_MUMBAI,
              type: AuthorizationType.ALLOWANCE
            }
          ])
        )
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
