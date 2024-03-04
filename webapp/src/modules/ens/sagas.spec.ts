import { ChainId } from '@dcl/schemas'
import * as matchers from 'redux-saga-test-plan/matchers'
import { Provider } from 'decentraland-connect'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { ethers, BigNumber } from 'ethers'
import { Route, AxelarProvider } from 'decentraland-transactions/crossChain'
import {
  getSigner,
  getConnectedProvider
} from 'decentraland-dapps/dist/lib/eth'
import {
  TRANSACTION_ACTION_FLAG,
  waitForTx
} from 'decentraland-dapps/dist/modules/transaction/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { ensSaga } from './sagas'
import {
  CLAIM_NAME_REQUEST,
  claimNameSuccess,
  claimNameFailure,
  claimNameTransactionSubmitted,
  claimNameRequest,
  CLAIM_NAME_TRANSACTION_SUBMITTED,
  claimNameCrossChainRequest,
  claimNameCrossChainFailure,
  claimNameCrossChainSuccess
} from './actions'
import { getWallet } from '../wallet/selectors'
import { DCLController__factory } from '../../contracts/factories/DCLController__factory'
import { DCLRegistrar__factory } from '../../contracts/factories'
import { config } from '../../config'
import { getDomainFromName } from './utils'
import { ENS } from './types'

export const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')
const CONTROLLER_V2_ADDRESS = config.get('CONTROLLER_V2_CONTRACT_ADDRESS', '')

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
    let mockTokenId: BigNumber
    let dclRegistrarContract: { address: string }
    let signer: ethers.Signer

    beforeEach(() => {
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
      mockTokenId = BigNumber.from(1)
      dclRegistrarContract = { address: '0xAnAddress' }
      signer = {} as ethers.Signer
    })

    describe('and the claim name succeeds', () => {
      it('should put a claim name transaction submitted action', () => {
        return expectSaga(ensSaga)
          .provide([
            [select(getWallet), mockWallet],
            [call(getSigner), signer],
            [
              call(
                [DCLController__factory, 'connect'],
                CONTROLLER_V2_ADDRESS,
                signer
              ),
              { register: () => Promise.resolve(mockTransaction) }
            ],
            [
              call(
                [DCLRegistrar__factory, 'connect'],
                REGISTRAR_ADDRESS,
                signer
              ),
              {
                ...dclRegistrarContract,
                getTokenId: () => mockTokenId
              }
            ],
            [call(waitForTx, mockTransaction.hash), null],
            [
              claimNameTransactionSubmitted(
                mockName,
                mockWallet.address,
                mockWallet.chainId,
                mockTransaction.hash
              ),
              undefined
            ]
          ])
          .put(
            claimNameTransactionSubmitted(
              mockName,
              mockWallet.address,
              mockWallet.chainId,
              mockTransaction.hash
            )
          )
          .put(closeModal('ClaimNameFatFingerModal'))
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
            [call(getSigner), {}],
            [
              call(
                [DCLController__factory, 'connect'],
                CONTROLLER_V2_ADDRESS,
                signer
              ),
              { register: () => Promise.reject(error) }
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
          .put(
            claimNameCrossChainFailure(
              route,
              mockName,
              'A wallet is required to claim a name'
            )
          )
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
          .put(
            claimNameCrossChainFailure(
              route,
              mockName,
              'A connected provider is required claim a name'
            )
          )
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
            [
              matchers.call.fn(AxelarProvider.prototype.executeRoute),
              Promise.resolve(mockTransaction)
            ],
            [
              claimNameTransactionSubmitted(
                mockName,
                mockWallet.address,
                mockWallet.chainId,
                mockTransaction.transactionHash,
                route
              ),
              undefined
            ]
          ])
          .call.like({
            fn: AxelarProvider.prototype.executeRoute,
            args: [route, provider]
          })
          .put(
            claimNameTransactionSubmitted(
              mockName,
              mockWallet.address,
              mockWallet.chainId,
              mockTransaction.transactionHash,
              route
            )
          )
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
            [
              matchers.call.fn(AxelarProvider.prototype.executeRoute),
              Promise.reject(error)
            ]
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
      mockAction = {
        type: CLAIM_NAME_TRANSACTION_SUBMITTED,
        payload: {
          [TRANSACTION_ACTION_FLAG]: {
            chainId: mockWallet.chainId,
            hash: mockTransaction.hash,
            payload: {
              address: mockWallet.address,
              subdomain: mockName
            }
          }
        }
      }
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
                call(
                  [DCLRegistrar__factory, 'connect'],
                  REGISTRAR_ADDRESS,
                  signer
                ),
                {
                  ...dclRegistrarContract,
                  getTokenId: () => mockTokenId
                }
              ],
              [select(getWallet), mockWallet],
              [call(getSigner), signer],
              [
                call(
                  [DCLController__factory, 'connect'],
                  CONTROLLER_V2_ADDRESS,
                  signer
                ),
                { register: () => Promise.resolve(mockTransaction) }
              ]
            ])
            .put(claimNameSuccess(mockENS, mockName, mockTransaction.hash))
            .put(closeModal('ClaimNameFatFingerModal'))
            .dispatch(
              claimNameTransactionSubmitted(
                mockName,
                mockWallet.address,
                mockWallet.chainId,
                mockTransaction.hash
              )
            )
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
                call(
                  [DCLRegistrar__factory, 'connect'],
                  REGISTRAR_ADDRESS,
                  signer
                ),
                {
                  ...dclRegistrarContract,
                  getTokenId: () => mockTokenId
                }
              ],
              [select(getWallet), mockWallet],
              [call(getSigner), signer],
              [
                call(
                  [DCLController__factory, 'connect'],
                  CONTROLLER_V2_ADDRESS,
                  signer
                ),
                { register: () => Promise.resolve(mockTransaction) }
              ]
            ])
            .put(
              claimNameCrossChainSuccess(
                mockENS,
                mockName,
                mockTransaction.hash,
                route
              )
            )
            .put(closeModal('ClaimNameFatFingerModal'))
            .dispatch(
              claimNameTransactionSubmitted(
                mockName,
                mockWallet.address,
                mockWallet.chainId,
                mockTransaction.hash,
                route
              )
            )
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
            [
              call(
                [DCLRegistrar__factory, 'connect'],
                REGISTRAR_ADDRESS,
                signer
              ),
              { getTokenId: () => Promise.reject(error) }
            ]
          ])
          .put(claimNameFailure({ message: error.message }))
          .dispatch(mockAction)
          .silentRun()
      })
    })
  })
})
