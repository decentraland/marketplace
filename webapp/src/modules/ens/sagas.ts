import { BigNumber, ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  TRANSACTION_ACTION_FLAG,
  waitForTx
} from 'decentraland-dapps/dist/modules/transaction/utils'
import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { DCLController } from '../../contracts'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'
import { DCLController__factory } from '../../contracts/factories/DCLController__factory'
import { DCLRegistrar } from '../../contracts/DCLRegistrar'
import {
  CLAIM_NAME_REQUEST,
  ClaimNameRequestAction,
  claimNameSuccess,
  claimNameFailure,
  claimNameTransactionSubmitted,
  CLAIM_NAME_TRANSACTION_SUBMITTED,
  ClaimNameTransactionSubmittedAction
} from './actions'
import { ENS, ENSError } from './types'
import { getDomainFromName } from './utils'
import { config } from '../../config'
import { getWallet } from '../wallet/selectors'
import { isErrorWithMessage } from '../../lib/error'

export const CONTROLLER_V2_ADDRESS = config.get(
  'CONTROLLER_V2_CONTRACT_ADDRESS',
  ''
)
export const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')

export function* ensSaga() {
  yield takeEvery(CLAIM_NAME_REQUEST, handleClaimNameRequest)
  yield takeEvery(
    CLAIM_NAME_TRANSACTION_SUBMITTED,
    handleClaimNameSubmittedRequest
  )

  function* handleClaimNameSubmittedRequest(
    action: ClaimNameTransactionSubmittedAction
  ) {
    const data = action.payload[TRANSACTION_ACTION_FLAG]
    const {
      hash,
      payload: { subdomain, address }
    } = data

    const from = address

    try {
      yield call(waitForTx, hash)
      const signer: ethers.Signer = yield call(getSigner)

      const dclRegistrarContract: DCLRegistrar = yield call(
        [DCLRegistrar__factory, 'connect'],
        REGISTRAR_ADDRESS,
        signer
      )
      const tokenId: BigNumber = yield call(
        [dclRegistrarContract, 'getTokenId'],
        subdomain
      )
      if (from) {
        const ens: ENS = {
          name: subdomain,
          tokenId: tokenId.toString(),
          ensOwnerAddress: from,
          nftOwnerAddress: from,
          subdomain: getDomainFromName(subdomain),
          resolver: ethers.constants.AddressZero,
          content: ethers.constants.AddressZero,
          contractAddress: dclRegistrarContract.address
        }
        yield put(claimNameSuccess(ens, subdomain, hash))
        yield put(closeModal('ClaimNameFatFingerModal'))
      }
    } catch (error) {
      const ensError: ENSError = {
        message: isErrorWithMessage(error) ? error.message : 'Unknown error'
      }
      yield put(claimNameFailure(ensError))
    }
  }

  function* handleClaimNameRequest(action: ClaimNameRequestAction) {
    const { name } = action.payload
    try {
      const wallet: Wallet = yield select(getWallet)
      const signer: ethers.Signer = yield call(getSigner)
      const from = wallet.address

      const controllerContract: DCLController = yield call(
        [DCLController__factory, 'connect'],
        CONTROLLER_V2_ADDRESS,
        signer
      )
      const transaction: ethers.ContractTransaction = yield call(
        [controllerContract, 'register'],
        name,
        from
      )
      yield put(
        claimNameTransactionSubmitted(
          name,
          wallet.address,
          wallet.chainId,
          transaction.hash
        )
      )
    } catch (error) {
      const ensError: ENSError = {
        message: isErrorWithMessage(error) ? error.message : 'Unknown error'
      }
      yield put(claimNameFailure(ensError))
    }
  }
}
