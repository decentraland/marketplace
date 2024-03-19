import { BigNumber, ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import type { Route } from 'decentraland-transactions/crossChain'
import { getConnectedProvider, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { Provider, Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { TRANSACTION_ACTION_FLAG } from 'decentraland-dapps/dist/modules/transaction/types'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { DCLController } from '../../contracts'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'
import { DCLController__factory } from '../../contracts/factories/DCLController__factory'
import { DCLRegistrar } from '../../contracts/DCLRegistrar'
import { isErrorWithMessage } from '../../lib/error'
import { config } from '../../config'
import { getWallet } from '../wallet/selectors'
import {
  CLAIM_NAME_REQUEST,
  ClaimNameRequestAction,
  claimNameSuccess,
  claimNameFailure,
  claimNameTransactionSubmitted,
  CLAIM_NAME_TRANSACTION_SUBMITTED,
  ClaimNameTransactionSubmittedAction,
  ClaimNameCrossChainRequestAction,
  CLAIM_NAME_CROSS_CHAIN_REQUEST,
  claimNameCrossChainFailure,
  claimNameCrossChainSuccess
} from './actions'
import { ENS, ENSError } from './types'
import { getDomainFromName } from './utils'

export const CONTROLLER_V2_ADDRESS = config.get('CONTROLLER_V2_CONTRACT_ADDRESS', '')
export const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')

type ClaimNameTransaction = Omit<ClaimNameTransactionSubmittedAction['payload'][TRANSACTION_ACTION_FLAG], 'payload'> & {
  payload: { subdomain: string; address: string; route?: Route }
}

export function* ensSaga() {
  yield takeEvery(CLAIM_NAME_REQUEST, handleClaimNameRequest)
  yield takeEvery(CLAIM_NAME_TRANSACTION_SUBMITTED, handleClaimNameSubmittedRequest)
  yield takeEvery(CLAIM_NAME_CROSS_CHAIN_REQUEST, handleClaimNameCrossChainRequest)

  function* handleClaimNameSubmittedRequest(action: ClaimNameTransactionSubmittedAction) {
    const data: ClaimNameTransaction = action.payload[TRANSACTION_ACTION_FLAG]
    const {
      hash,
      payload: { subdomain, address, route }
    } = data

    const from = address

    try {
      yield call(waitForTx, hash)
      const signer: ethers.Signer = yield call(getSigner)

      const dclRegistrarContract: DCLRegistrar = yield call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer)
      const tokenId: BigNumber = yield call([dclRegistrarContract, 'getTokenId'], subdomain)
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

        if (route) {
          yield put(claimNameCrossChainSuccess(ens, subdomain, hash, route))
        } else {
          yield put(claimNameSuccess(ens, subdomain, hash))
        }
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

      const controllerContract: DCLController = yield call([DCLController__factory, 'connect'], CONTROLLER_V2_ADDRESS, signer)
      const transaction: ethers.ContractTransaction = yield call([controllerContract, 'register'], name, from)
      yield put(claimNameTransactionSubmitted(name, wallet.address, wallet.chainId, transaction.hash))
    } catch (error) {
      const ensError: ENSError = {
        message: isErrorWithMessage(error) ? error.message : 'Unknown error'
      }
      yield put(claimNameFailure(ensError))
    }
  }

  function* handleClaimNameCrossChainRequest(action: ClaimNameCrossChainRequestAction) {
    const { name, chainId, route } = action.payload
    try {
      const wallet: ReturnType<typeof getWallet> = yield select(getWallet)

      const provider: Provider | null = yield call(getConnectedProvider)

      if (!wallet) {
        throw new Error('A wallet is required to claim a name')
      }

      if (!provider) {
        throw new Error('A connected provider is required claim a name')
      }

      const crossChainModule = import('decentraland-transactions/crossChain')
      const { AxelarProvider }: Awaited<typeof crossChainModule> = yield crossChainModule

      const crossChainProvider = new AxelarProvider(config.get('SQUID_API_URL'))
      const txResponse: ethers.providers.TransactionReceipt = yield call([crossChainProvider, 'executeRoute'], route, provider)

      yield put(claimNameTransactionSubmitted(name, wallet.address, chainId, txResponse.transactionHash, route))
    } catch (error) {
      yield put(claimNameCrossChainFailure(route, name, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
