import { BigNumber, ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { ChainId } from '@dcl/schemas'
import { CreditsService } from 'decentraland-dapps/dist/lib/credits'
import { getConnectedProvider, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { TRANSACTION_ACTION_FLAG } from 'decentraland-dapps/dist/modules/transaction/types'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Provider, Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { RouteResponse } from 'decentraland-transactions/crossChain'
import signedFetch, { AuthIdentity } from 'decentraland-crypto-fetch'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { config } from '../../config'
import { DCLRegistrar } from '../../contracts/DCLRegistrar'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'
import { isErrorWithMessage } from '../../lib/error'
import { pollSquidRouteStatus, SquidStatusResponse } from '../../lib/squid'
import { getCurrentIdentity } from '../identity/selectors'
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
  claimNameCrossChainSuccess,
  CLAIM_NAME_WITH_CREDITS_REQUEST,
  ClaimNameWithCreditsRequestAction,
  claimNameWithCreditsSuccess,
  claimNameWithCreditsFailure,
  claimNameWithCreditsTransactionSubmitted
} from './actions'
import { ENS, ENSError } from './types'
import { getDomainFromName, PRICE_IN_WEI } from './utils'

export const CONTROLLER_V2_ADDRESS = config.get('CONTROLLER_V2_CONTRACT_ADDRESS', '')
export const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')

type ClaimNameTransaction = Omit<ClaimNameTransactionSubmittedAction['payload'][TRANSACTION_ACTION_FLAG], 'payload'> & {
  payload: { subdomain: string; address: string; route?: RouteResponse }
}

export function* ensSaga() {
  yield takeEvery(CLAIM_NAME_REQUEST, handleClaimNameRequest)
  yield takeEvery(CLAIM_NAME_TRANSACTION_SUBMITTED, handleClaimNameSubmittedRequest)
  yield takeEvery(CLAIM_NAME_CROSS_CHAIN_REQUEST, handleClaimNameCrossChainRequest)
  yield takeEvery(CLAIM_NAME_WITH_CREDITS_REQUEST, handleClaimNameWithCreditsRequest)

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

      if (!wallet) {
        throw new Error('A wallet is required to claim a name')
      }

      const from = wallet.address

      const contract = (yield call(getContract, ContractName.DCLControllerV2, wallet.chainId)) as ContractData

      const transactionHash = (yield call(
        sendTransaction as (contract: ContractData, contractMethodName: string, ...contractArguments: any[]) => Promise<string>,
        contract,
        'register',
        name,
        from
      )) as string

      yield put(claimNameTransactionSubmitted(name, wallet.address, wallet.chainId, transactionHash))
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
      )) as ethers.providers.TransactionReceipt

      yield put(claimNameTransactionSubmitted(name, wallet.address, chainId, txResponse.transactionHash, route))
    } catch (error) {
      yield put(claimNameCrossChainFailure(route, name, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  // Handle Claim name with CORAL + Credits
  function* handleClaimNameWithCreditsRequest(action: ClaimNameWithCreditsRequestAction) {
    const { name } = action.payload

    try {
      const wallet: Wallet | null = yield select(getWallet)
      const credits: CreditsResponse = yield select(getCredits, wallet?.address || '')

      if (!wallet) {
        throw new Error('Wallet not connected')
      }

      if (!credits || credits.totalCredits === 0) {
        throw new Error('No credits available')
      }

      // Get route from backend using signed fetch
      const identity: AuthIdentity | null = yield select(getCurrentIdentity)
      if (!identity) {
        throw new Error('No identity available for signed fetch')
      }

      const creditsServerUrl = config.get('CREDITS_SERVER_URL')
      const url = `${creditsServerUrl}/credits-name-route?name=${encodeURIComponent(name)}&chainId=${ChainId.MATIC_MAINNET}`

      const response: Response = yield call(() =>
        signedFetch(url, {
          method: 'GET',
          identity: identity
        })
      )

      if (!response.ok) {
        const errorData: { error: string; message: string } = yield call(() => response.json())
        throw new Error(`Credits server error: ${errorData.error || errorData.message || response.statusText}`)
      }

      const routeData: {
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
      } = yield call(() => response.json())

      // Use CreditsService to handle the transaction
      const creditsService = new CreditsService()
      const txHash: string = yield call(
        [creditsService, 'useCreditsWithExternalCall'],
        PRICE_IN_WEI,
        credits.credits,
        ChainId.MATIC_MAINNET,
        routeData.externalCall,
        routeData.customExternalCallSignature
      )

      // Poll Squid Router API to wait for cross-chain completion
      // Dispatch transaction submitted action and redirect to SuccessPage (loading state)
      yield put(claimNameWithCreditsTransactionSubmitted(name, wallet.address, ChainId.MATIC_MAINNET, txHash))
      yield put(closeModal('BuyWithCryptoModal'))

      // Get Squid Router API configuration
      const squidRouterApiUrl = config.get('REACT_APP_SQUID_ROUTER_API_URL', 'https://v2.api.squidrouter.com')
      const squidIntegratorId = config.get('REACT_APP_SQUID_INTEGRATOR_ID', 'decentraland-sdk-coral-test')

      try {
        // Poll for cross-chain transaction completion
        const statusResponse: SquidStatusResponse = yield call(pollSquidRouteStatus, {
          transactionId: txHash,
          fromChainId: routeData.fromChainId,
          toChainId: routeData.toChainId,
          quoteId: routeData.quoteId,
          integratorId: squidIntegratorId,
          apiUrl: squidRouterApiUrl
        })

        // Extract the Ethereum (destination chain) transaction hash
        const ethereumTxHash = statusResponse.toChain?.transactionId || txHash

        // Create ENS object for success action
        const ens: ENS = {
          name: `${name}.dcl.eth`,
          tokenId: '0',
          ensOwnerAddress: wallet.address,
          nftOwnerAddress: wallet.address,
          subdomain: name,
          resolver: CONTROLLER_V2_ADDRESS,
          content: '',
          contractAddress: CONTROLLER_V2_ADDRESS
        }

        // Dispatch success action with the Ethereum transaction hash
        yield put(claimNameWithCreditsSuccess(ens, name, ethereumTxHash))
      } catch (pollingError) {
        // Dispatch failure action
        yield put(
          claimNameWithCreditsFailure(
            name,
            isErrorWithMessage(pollingError)
              ? pollingError.message
              : 'Cross-chain transaction failed. Please check the Activity page for details.'
          )
        )
      }
    } catch (error) {
      yield put(claimNameWithCreditsFailure(name, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
