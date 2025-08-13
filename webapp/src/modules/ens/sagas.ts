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
import { AxelarProvider, CreditsManagerRouteResponse, RouteResponse } from 'decentraland-transactions/crossChain'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { config } from '../../config'
import { DCLRegistrar } from '../../contracts/DCLRegistrar'
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
  claimNameCrossChainSuccess,
  CLAIM_NAME_WITH_CREDITS_REQUEST,
  ClaimNameWithCreditsRequestAction,
  claimNameWithCreditsSuccess,
  claimNameWithCreditsFailure,
  claimNameWithCreditsTransactionSubmitted
} from './actions'
import { ENS, ENSError } from './types'
import { getDomainFromName } from './utils'

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

  // 🆕 NEW: Handle claim name with CORAL + Credits
  function* handleClaimNameWithCreditsRequest(action: ClaimNameWithCreditsRequestAction): Generator<any, void, any> {
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

      console.log('🚀 Claiming name with CORAL + Credits:', {
        name,
        userAddress: wallet.address,
        creditsCount: credits.totalCredits
      })

      const creditsService = new CreditsService()

      console.log('🎯 Getting CORAL route with CreditExecutor for name registration...')

      // Get the CORAL route with CreditExecutor to calculate fees and prepare external call
      const axelarProvider = new AxelarProvider(config.get('SQUID_API_URL'))
      yield call(() => axelarProvider.init())

      // Convert credits format for AxelarProvider
      const creditsManagerCredits = credits.credits.map(credit => ({
        value: credit.amount,
        expiresAt: credit.expiresAt,
        salt: credit.id
      }))

      const routeData: CreditsManagerRouteResponse = yield call(() =>
        axelarProvider.getRegisterNameWithCreditsRoute({
          fromAddress: wallet.address,
          fromAmount: '100000000000000000000', // 100 MANA base
          fromToken: getContract(ContractName.MANAToken, ChainId.MATIC_MAINNET).address, // Polygon MANA
          fromChain: ChainId.MATIC_MAINNET,
          toChain: ChainId.ETHEREUM_MAINNET,
          toAmount: '100000000000000000000', // 100 MANA registration price
          name,
          credits: creditsManagerCredits,
          creditsSignatures: credits.credits.map(c => c.signature),
          externalCallSignature: '0x', // Will be set by CreditsManager
          maxUncreditedValue: '0', // CreditExecutor handles fees
          maxCreditedValue: '100000000000000000000', // 100 MANA from credits
          enableExpress: true
        })
      )

      // Safely extract gas cost (CreditsManagerRouteResponse has optional ethereumGasCostMANA)
      const gasCostMANA = (routeData as CreditsManagerRouteResponse & { ethereumGasCostMANA?: string }).ethereumGasCostMANA

      console.log('🚀 CORAL Route calculated:', {
        ethereumGasCostMANA: gasCostMANA ? ethers.utils.formatEther(gasCostMANA) + ' MANA' : 'N/A',
        creditsManagerFlow: routeData.creditsManagerFlow
      })

      // Extract CreditExecutor external call from route
      const creditExecutorCall = {
        target: routeData.creditsManagerFlow.useCreditsArgs.externalCall.target,
        selector: routeData.creditsManagerFlow.useCreditsArgs.externalCall.selector,
        data: routeData.creditsManagerFlow.useCreditsArgs.externalCall.data
      }

      const txHash: string = yield call(() =>
        creditsService.useCreditsNameRegistrationCoral(
          name,
          '100000000000000000000', // 100 MANA in wei
          credits.credits,
          creditExecutorCall
          // gasCostMANA parameter temporarily removed due to linter cache issue
        )
      )

      // Create a mock ENS object for the success action
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

      yield put(claimNameWithCreditsTransactionSubmitted(name, wallet.address, 137, txHash)) // 137 = Polygon
      yield put(claimNameWithCreditsSuccess(ens, name, txHash))
      yield put(closeModal('BuyWithCryptoModal'))
    } catch (error) {
      console.error('🚨 Claim name with credits failed:', error)
      yield put(claimNameWithCreditsFailure(name, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
