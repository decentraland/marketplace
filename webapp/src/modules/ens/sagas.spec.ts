import { ethers, BigNumber } from 'ethers'
import { call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { ChainId } from '@dcl/schemas'
import { CreditsService } from 'decentraland-dapps/dist/lib/credits'
import { getSigner, getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { CreditsClient } from 'decentraland-dapps/dist/modules/credits/CreditsClient'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { Route, AxelarProvider } from 'decentraland-transactions/crossChain'
import { Provider } from 'decentraland-connect'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { config } from '../../config'
import { DCLRegistrar__factory } from '../../contracts/factories'
import { DCLController__factory } from '../../contracts/factories/DCLController__factory'
import { pollSquidRouteStatus, SquidStatusResponse, SquidTransactionStatus } from '../../lib/squid'
import { getCurrentIdentity } from '../identity/selectors'
import { getWallet } from '../wallet/selectors'
import {
  CLAIM_NAME_REQUEST,
  claimNameSuccess,
  claimNameFailure,
  claimNameTransactionSubmitted,
  claimNameRequest,
  claimNameCrossChainRequest,
  claimNameCrossChainFailure,
  claimNameCrossChainSuccess,
  claimNameWithCreditsRequest,
  claimNameWithCreditsFailure,
  claimNameWithCreditsTransactionSubmitted,
  claimNameWithCreditsSuccess,
  claimNameWithCreditsCrossChainPolling
} from './actions'
import { ensSaga, CONTROLLER_V2_ADDRESS, CORAL_SCAN_BASE_URL, getTokenIdFromEthereumContract } from './sagas'
import { ENS } from './types'
import { getDomainFromName } from './utils'

export const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')

describe('ENS Saga', () => {
  let chainId: ChainId
  let mockName: string

  beforeEach(() => {
    mockName = 'example'
    chainId = ChainId.ETHEREUM_MAINNET
  })

  describe('when handling a claim name request action', () => {
    let mockAction: ReturnType<typeof claimNameRequest>
    let mockWallet: Wallet
    let mockTransaction: ethers.ContractTransaction
    let mockedContract: { register: () => Promise<ethers.ContractTransaction> } & ContractData

    beforeEach(() => {
      mockedContract = {
        register: () => Promise.resolve(mockTransaction)
      } as ContractData & { register: () => Promise<ethers.ContractTransaction> }
      mockAction = {
        type: CLAIM_NAME_REQUEST,
        payload: { name: mockName }
      }
      mockWallet = {
        address: '0xWalletAddress',
        chainId: ChainId.ETHEREUM_MAINNET
      } as Wallet
      mockTransaction = {
        hash: '0xTransactionHash'
      } as ethers.ContractTransaction
    })

    describe('and the claim name succeeds', () => {
      it('should put a claim name transaction submitted action', () => {
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [call(getContract, ContractName.DCLControllerV2, mockWallet.chainId), mockedContract],
            [
              call(
                sendTransaction as (contract: ContractData, contractMethodName: string, ...contractArguments: any[]) => Promise<string>,
                mockedContract,
                'register',
                mockName,
                mockWallet.address
              ),
              mockTransaction.hash
            ],
            [claimNameTransactionSubmitted(mockName, mockWallet.address, mockWallet.chainId, mockTransaction.hash), undefined]
          ])
          .put(claimNameTransactionSubmitted(mockName, mockWallet.address, mockWallet.chainId, mockTransaction.hash))
          .dispatch(claimNameRequest(mockName))
          .silentRun()
      })
    })

    describe('and the claim fails', () => {
      it('should put a claim name failure action with the error', () => {
        const error = new Error('Failed to claim name')
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [call(getContract, ContractName.DCLControllerV2, mockWallet.chainId), mockedContract],
            [
              call(
                sendTransaction as (contract: ContractData, contractMethodName: string, ...contractArguments: any[]) => Promise<string>,
                mockedContract,
                'register',
                mockName,
                mockWallet.address
              ),
              Promise.reject(error)
            ]
          ])
          .put(claimNameFailure({ message: error.message }))
          .dispatch(mockAction)
          .silentRun()
      })
    })
  })

  describe('when handling the claim name cross chain request action', () => {
    let route: Route

    beforeEach(() => {
      route = {} as Route
      chainId = ChainId.ETHEREUM_MAINNET
    })

    describe("and there's no wallet connected", () => {
      it('should put a claim cross chain name failure action', () => {
        return expectSaga(ensSaga)
          .provide([[select(getWallet), null]])
          .put(claimNameCrossChainFailure(route, mockName, 'A wallet is required to claim a name'))
          .dispatch(claimNameCrossChainRequest(mockName, chainId, route))
          .silentRun()
      })
    })

    describe("and there's no provider connected", () => {
      it('should put a claim cross chain name failure action', () => {
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), { address: '0xWalletAddress' }],
            [call(getConnectedProvider), null]
          ])
          .put(claimNameCrossChainFailure(route, mockName, 'A connected provider is required claim a name'))
          .dispatch(claimNameCrossChainRequest(mockName, chainId, route))
          .silentRun()
      })
    })

    describe('and claiming the name succeeds', () => {
      let provider: Provider
      let mockWallet: Wallet
      let mockTransaction: ethers.providers.TransactionReceipt

      beforeEach(() => {
        provider = {} as Provider
        mockWallet = {
          address: '0xWalletAddress',
          chainId: ChainId.ETHEREUM_MAINNET
        } as Wallet
        mockTransaction = {
          transactionHash: '0xTransactionHash'
        } as ethers.providers.TransactionReceipt
      })

      it('should put a claim name transaction submitted action', () => {
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [call(getConnectedProvider), Promise.resolve(provider)],
            [matchers.call.fn(AxelarProvider.prototype.executeRoute), Promise.resolve(mockTransaction)],
            [
              claimNameTransactionSubmitted(mockName, mockWallet.address, mockWallet.chainId, mockTransaction.transactionHash, route),
              undefined
            ]
          ])
          .call.like({
            fn: AxelarProvider.prototype.executeRoute,
            args: [route, provider]
          })
          .put(claimNameTransactionSubmitted(mockName, mockWallet.address, mockWallet.chainId, mockTransaction.transactionHash, route))
          .dispatch(claimNameCrossChainRequest(mockName, chainId, route))
          .silentRun()
      })
    })

    describe('and claiming the name fails', () => {
      let provider: Provider
      let mockWallet: Wallet

      beforeEach(() => {
        provider = {} as Provider
        mockWallet = {
          address: '0xWalletAddress',
          chainId: ChainId.ETHEREUM_MAINNET
        } as Wallet
      })

      it('should put a claim cross chain name failure action', () => {
        const error = new Error('Failed to claim name')
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [call(getConnectedProvider), Promise.resolve(provider)],
            [matchers.call.fn(AxelarProvider.prototype.executeRoute), Promise.reject(error)]
          ])
          .put(claimNameCrossChainFailure(route, mockName, error.message))
          .dispatch(claimNameCrossChainRequest(mockName, chainId, route))
          .silentRun()
      })
    })
  })

  describe('when handling a claim name submitted request action', () => {
    let mockName: string
    let mockAction: ReturnType<typeof claimNameTransactionSubmitted>
    let mockWallet: Wallet
    let mockTransaction: ethers.ContractTransaction
    let mockTokenId: BigNumber
    let dclRegistrarContract: { address: string }
    let mockENS: ENS
    let signer: ethers.Signer

    beforeEach(() => {
      mockName = 'example'
      mockWallet = { address: '0xWalletAddress', chainId: 1 } as Wallet
      mockTransaction = {
        hash: '0xTransactionHash'
      } as ethers.ContractTransaction
      mockAction = claimNameTransactionSubmitted(mockName, mockWallet.address, ChainId.ARBITRUM_MAINNET, mockTransaction.hash)
      mockTokenId = BigNumber.from(1)
      dclRegistrarContract = { address: '0xAnAddress' }
      mockENS = {
        name: mockName,
        tokenId: mockTokenId.toString(),
        ensOwnerAddress: mockWallet.address,
        nftOwnerAddress: mockWallet.address,
        subdomain: getDomainFromName(mockName),
        resolver: ethers.constants.AddressZero,
        content: ethers.constants.AddressZero,
        contractAddress: dclRegistrarContract.address
      }
      signer = {} as ethers.Signer
    })

    describe('and the claim name succeeds', () => {
      describe('and the claim is not cross chain', () => {
        it('should put a successful name claim action', () => {
          return expectSaga(ensSaga)
            .provide([
              [call(waitForTx, mockTransaction.hash), null],
              [
                call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer),
                {
                  ...dclRegistrarContract,
                  getTokenId: () => mockTokenId
                }
              ],
              [select(getWallet), mockWallet],
              [call(getSigner), signer],
              [
                call([DCLController__factory, 'connect'], CONTROLLER_V2_ADDRESS, signer),
                { register: () => Promise.resolve(mockTransaction) }
              ]
            ])
            .put(claimNameSuccess(mockENS, mockName, mockTransaction.hash))
            .put(closeModal('ClaimNameFatFingerModal'))
            .dispatch(claimNameTransactionSubmitted(mockName, mockWallet.address, mockWallet.chainId, mockTransaction.hash))
            .silentRun()
        })
      })

      describe('and the claim is cross chain', () => {
        let route: Route

        beforeEach(() => {
          route = {} as Route
        })

        it('should put a successful cross chain name claim action', () => {
          return expectSaga(ensSaga)
            .provide([
              [call(waitForTx, mockTransaction.hash), null],
              [
                call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer),
                {
                  ...dclRegistrarContract,
                  getTokenId: () => mockTokenId
                }
              ],
              [select(getWallet), mockWallet],
              [call(getSigner), signer],
              [
                call([DCLController__factory, 'connect'], CONTROLLER_V2_ADDRESS, signer),
                { register: () => Promise.resolve(mockTransaction) }
              ]
            ])
            .put(claimNameCrossChainSuccess(mockENS, mockName, mockTransaction.hash, route))
            .put(closeModal('ClaimNameFatFingerModal'))
            .dispatch(claimNameTransactionSubmitted(mockName, mockWallet.address, mockWallet.chainId, mockTransaction.hash, route))
            .silentRun()
        })
      })
    })

    describe('and the claim fails', () => {
      it('should handle a failure in name claim', () => {
        const error = new Error('Failed to claim name')
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [call(waitForTx, mockTransaction.hash), null],
            [call(getSigner), {}],
            [call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer), { getTokenId: () => Promise.reject(error) }]
          ])
          .put(claimNameFailure({ message: error.message }))
          .dispatch(mockAction)
          .silentRun()
      })
    })
  })

  describe('when handling a claim name with credits request action', () => {
    let mockName: string
    let mockWallet: Wallet
    let mockCredits: CreditsResponse

    beforeEach(() => {
      mockName = 'testname'
      mockWallet = {
        address: '0xWalletAddress',
        chainId: ChainId.MATIC_MAINNET
      } as Wallet
      mockCredits = {
        credits: [
          {
            id: '0x123',
            amount: '150000000000000000000',
            availableAmount: '150000000000000000000',
            expiresAt: '1234567890',
            signature: '0xsignature',
            contract: '0xCreditsManager',
            season: 1,
            timestamp: '1234567890',
            userAddress: mockWallet.address
          }
        ],
        totalCredits: 150000000000000000000
      }
    })

    describe('and no credits are available', () => {
      let emptyCredits: CreditsResponse

      beforeEach(() => {
        emptyCredits = {
          credits: [],
          totalCredits: 0
        }
      })

      it('should put a failure action', () => {
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [select(getCredits, mockWallet.address), emptyCredits]
          ])
          .put(claimNameWithCreditsFailure(mockName, 'No credits available'))
          .dispatch(claimNameWithCreditsRequest(mockName))
          .silentRun()
      })
    })

    describe('and the wallet is not connected', () => {
      it('should put a failure action', () => {
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), null],
            [select(getCredits, ''), mockCredits]
          ])
          .put(claimNameWithCreditsFailure(mockName, 'Wallet not connected'))
          .dispatch(claimNameWithCreditsRequest(mockName))
          .silentRun()
      })
    })

    describe('and no identity is available', () => {
      it('should put a failure action', () => {
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [select(getCredits, mockWallet.address), mockCredits],
            [select(getCurrentIdentity), null]
          ])
          .put(claimNameWithCreditsFailure(mockName, 'No identity available for signed fetch'))
          .dispatch(claimNameWithCreditsRequest(mockName))
          .silentRun()
      })
    })

    describe('and the credits client fails', () => {
      let mockIdentity: AuthIdentity

      beforeEach(() => {
        mockIdentity = {} as AuthIdentity
      })

      it('should put a failure action with the error message', () => {
        const clientError = new Error('Server error: Something went wrong')

        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [select(getCredits, mockWallet.address), mockCredits],
            [select(getCurrentIdentity), mockIdentity],
            [
              matchers.call.fn(CreditsClient.prototype.fetchCreditsNameRoute as (...args: unknown[]) => Promise<unknown>),
              Promise.reject(clientError)
            ]
          ])
          .put(claimNameWithCreditsFailure(mockName, clientError.message))
          .dispatch(claimNameWithCreditsRequest(mockName))
          .silentRun()
      })
    })

    describe('and the full flow succeeds', () => {
      let mockIdentity: AuthIdentity
      let mockRouteData: {
        externalCall: {
          target: string
          selector: string
          data: string
          expiresAt: number
          salt: string
        }
        customExternalCallSignature: string
        quoteId: string
        estimatedRouteDuration: number
        fromChainId: string
        toChainId: string
      }
      let mockTxHash: string
      let mockSquidResponse: SquidStatusResponse

      beforeEach(() => {
        mockIdentity = {} as AuthIdentity
        // Use a future timestamp (current time + 5 minutes) to ensure route is valid
        const futureExpiresAt = Math.floor(Date.now() / 1000) + 300
        mockRouteData = {
          externalCall: {
            target: '0xTargetAddress',
            selector: '0x12345678',
            data: '0xData',
            expiresAt: futureExpiresAt,
            salt: '0xSalt'
          },
          customExternalCallSignature: '0xSignature',
          quoteId: 'quote-123',
          estimatedRouteDuration: 300,
          fromChainId: '137',
          toChainId: '1'
        }
        mockTxHash = '0xTransactionHash'
        mockSquidResponse = {
          id: 'response-id',
          status: 'success',
          gasStatus: 'success',
          isGMPTransaction: true,
          squidTransactionStatus: SquidTransactionStatus.SUCCESS,
          axelarTransactionUrl: 'https://axelarscan.io/tx/123',
          fromChain: {
            transactionId: mockTxHash,
            blockNumber: '12345',
            callEventStatus: 'success',
            callEventLog: [],
            chainData: {},
            transactionUrl: 'https://polygonscan.com/tx/123'
          },
          toChain: {
            transactionId: '0xEthereumTxHash',
            blockNumber: '67890',
            callEventStatus: 'success',
            callEventLog: [],
            chainData: {},
            transactionUrl: 'https://etherscan.io/tx/456'
          },
          timeSpent: { total: 180 },
          routeStatus: []
        }
      })

      it('should dispatch transaction submitted, polling action, success action, and close modal', () => {
        const mockTokenId = BigNumber.from('12345')

        const expectedENS: ENS = {
          name: mockName,
          tokenId: mockTokenId.toString(),
          ensOwnerAddress: mockWallet.address,
          nftOwnerAddress: mockWallet.address,
          subdomain: getDomainFromName(mockName),
          resolver: ethers.constants.AddressZero,
          content: ethers.constants.AddressZero,
          contractAddress: REGISTRAR_ADDRESS
        }
        const coralScanUrl = `${CORAL_SCAN_BASE_URL}/${mockTxHash}`

        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [select(getCredits, mockWallet.address), mockCredits],
            [select(getCurrentIdentity), mockIdentity],
            [matchers.call.fn(CreditsClient.prototype.fetchCreditsNameRoute as (...args: unknown[]) => Promise<unknown>), mockRouteData],
            [matchers.call.fn(CreditsService.prototype.useCreditsWithExternalCall as (...args: unknown[]) => Promise<string>), mockTxHash],
            [matchers.call.fn(pollSquidRouteStatus), mockSquidResponse],
            [matchers.call.fn(getTokenIdFromEthereumContract), mockTokenId]
          ])
          .put(claimNameWithCreditsTransactionSubmitted(mockName, mockWallet.address, ChainId.MATIC_MAINNET, mockTxHash))
          .put(claimNameWithCreditsCrossChainPolling(mockName, mockTxHash, coralScanUrl))
          .put(claimNameWithCreditsSuccess(expectedENS, mockName, '0xEthereumTxHash'))
          .put(closeModal('BuyWithCryptoModal'))
          .dispatch(claimNameWithCreditsRequest(mockName))
          .silentRun()
      })
    })

    describe('and the squid polling fails', () => {
      let mockIdentity: AuthIdentity
      let mockRouteData: {
        externalCall: {
          target: string
          selector: string
          data: string
          expiresAt: number
          salt: string
        }
        customExternalCallSignature: string
        quoteId: string
        estimatedRouteDuration: number
        fromChainId: string
        toChainId: string
      }
      let mockTxHash: string

      beforeEach(() => {
        mockIdentity = {} as AuthIdentity
        // Use a future timestamp (current time + 5 minutes) to ensure route is valid
        const futureExpiresAt = Math.floor(Date.now() / 1000) + 300
        mockRouteData = {
          externalCall: {
            target: '0xTargetAddress',
            selector: '0x12345678',
            data: '0xData',
            expiresAt: futureExpiresAt,
            salt: '0xSalt'
          },
          customExternalCallSignature: '0xSignature',
          quoteId: 'quote-123',
          estimatedRouteDuration: 300,
          fromChainId: '137',
          toChainId: '1'
        }
        mockTxHash = '0xTransactionHash'
      })

      it('should dispatch transaction submitted, polling action, failure action, and close modal', () => {
        const pollingError = new Error('Cross-chain transaction polling timeout')
        const coralScanUrl = `${CORAL_SCAN_BASE_URL}/${mockTxHash}`

        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [select(getCredits, mockWallet.address), mockCredits],
            [select(getCurrentIdentity), mockIdentity],
            [matchers.call.fn(CreditsClient.prototype.fetchCreditsNameRoute as (...args: unknown[]) => Promise<unknown>), mockRouteData],
            [matchers.call.fn(CreditsService.prototype.useCreditsWithExternalCall as (...args: unknown[]) => Promise<string>), mockTxHash],
            [matchers.call.fn(pollSquidRouteStatus), Promise.reject(pollingError)]
          ])
          .put(claimNameWithCreditsTransactionSubmitted(mockName, mockWallet.address, ChainId.MATIC_MAINNET, mockTxHash))
          .put(claimNameWithCreditsCrossChainPolling(mockName, mockTxHash, coralScanUrl))
          .put(claimNameWithCreditsFailure(mockName, pollingError.message))
          .put(closeModal('BuyWithCryptoModal'))
          .dispatch(claimNameWithCreditsRequest(mockName))
          .silentRun()
      })
    })
  })
})
