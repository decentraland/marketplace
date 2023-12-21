import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { ethers, BigNumber } from 'ethers'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { ensSaga } from './sagas'
import {
  CLAIM_NAME_REQUEST,
  claimNameSuccess,
  claimNameFailure,
  claimNameTransactionSubmitted,
  claimNameRequest
} from './actions'
import { getWallet } from '../wallet/selectors'
import { DCLController__factory } from '../../contracts/factories/DCLController__factory'
import { DCLRegistrar__factory } from '../../contracts/factories'
import { config } from '../../config'
import { getDomainFromName } from './utils'

export const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')
const CONTROLLER_V2_ADDRESS = config.get('CONTROLLER_V2_CONTRACT_ADDRESS', '')

describe('ENS Saga', () => {
  describe('handleClaimNameRequest', () => {
    const mockName = 'example'
    const mockAction = { type: CLAIM_NAME_REQUEST, payload: { name: mockName } }
    const mockWallet = { address: '0xWalletAddress', chainId: 1 } as Wallet
    const mockTransaction = {
      hash: '0xTransactionHash'
    } as ethers.ContractTransaction
    const mockTokenId = BigNumber.from(1)
    const dclRegistrarContract = { address: '0xAnAddress' }
    const mockENS = {
      name: mockName,
      tokenId: mockTokenId.toString(),
      ensOwnerAddress: mockWallet.address,
      nftOwnerAddress: mockWallet.address,
      subdomain: getDomainFromName(mockName),
      resolver: ethers.constants.AddressZero,
      content: ethers.constants.AddressZero,
      contractAddress: dclRegistrarContract.address
    }
    const signer = {} as ethers.Signer

    it('should handle a successful name claim', () => {
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
            call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer),
            {
              ...dclRegistrarContract,
              getTokenId: () => mockTokenId
            }
          ],

          [call(waitForTx, mockTransaction.hash), null]
        ])
        .put(
          claimNameTransactionSubmitted(
            mockName,
            mockWallet.address,
            mockWallet.chainId,
            mockTransaction.hash
          )
        )
        .put(claimNameSuccess(mockENS, mockName, mockTransaction.hash))
        .put(closeModal('ClaimNameFatFingerModal'))
        .dispatch(claimNameRequest(mockName))
        .silentRun()
    })

    it('should handle a failure in name claim', () => {
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
          ],
          [
            call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer),
            {
              ...dclRegistrarContract,
              getTokenId: () => mockTokenId
            }
          ]
        ])
        .put(claimNameFailure({ message: error.message }))
        .dispatch(mockAction)
        .silentRun()
    })
  })
})
