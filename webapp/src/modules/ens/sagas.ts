import { BigNumber, ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { getConnectedProvider, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { TRANSACTION_ACTION_FLAG } from 'decentraland-dapps/dist/modules/transaction/types'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Provider, Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import type { Route } from 'decentraland-transactions/crossChain'
import { config } from '../../config'
import { DCLController } from '../../contracts'
import { DCLRegistrar } from '../../contracts/DCLRegistrar'
import { DCLController__factory } from '../../contracts/factories/DCLController__factory'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'
import { isErrorWithMessage } from '../../lib/error'
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
      const signer: ethers.Signer = (yield call(getSigner)) as Awaited<ReturnType<typeof getSigner>>

      const dclRegistrarContract: DCLRegistrar = (yield call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer)) as Awaited<
        ReturnType<typeof DCLRegistrar__factory.connect>
      >
      const tokenId: BigNumber = (yield call([dclRegistrarContract, 'getTokenId'], subdomain)) as Awaited<
        ReturnType<typeof dclRegistrarContract.getTokenId>
      >
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
      const wallet: Wallet | null = (yield select(getWallet)) as Awaited<ReturnType<typeof getWallet>>
      const signer: ethers.Signer = (yield call(getSigner)) as Awaited<ReturnType<typeof getSigner>>

      if (!wallet) {
        throw new Error('A wallet is required to claim a name')
      }

      const from = wallet.address
      const controllerContract: DCLController = (yield call([DCLController__factory, 'connect'], CONTROLLER_V2_ADDRESS, signer)) as Awaited<
        ReturnType<typeof DCLController__factory.connect>
      >
      const transaction: ethers.ContractTransaction = (yield call([controllerContract, 'register'], name, from)) as Awaited<
        ReturnType<typeof controllerContract.register>
      >
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
      const wallet: ReturnType<typeof getWallet> = (yield select(getWallet)) as Awaited<ReturnType<typeof getWallet>>

      const provider: Provider | null = (yield call(getConnectedProvider)) as Awaited<ReturnType<typeof getConnectedProvider>>

      if (!wallet) {
        throw new Error('A wallet is required to claim a name')
      }

      if (!provider) {
        throw new Error('A connected provider is required claim a name')
      }

      const crossChainModule = import('decentraland-transactions/crossChain')
      const { AxelarProvider }: Awaited<typeof crossChainModule> = (yield crossChainModule) as Awaited<typeof crossChainModule>

      const crossChainProvider = new AxelarProvider(config.get('SQUID_API_URL'))
      const txResponse: ethers.providers.TransactionReceipt = (yield call(
        [crossChainProvider, 'executeRoute'],
        route,
        provider
      )) as Awaited<ReturnType<typeof crossChainProvider.executeRoute>>

      yield put(claimNameTransactionSubmitted(name, wallet.address, chainId, txResponse.transactionHash, route))
    } catch (error) {
      yield put(claimNameCrossChainFailure(route, name, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
