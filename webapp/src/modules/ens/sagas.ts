import { captureException } from '@sentry/react'
import { BigNumber, ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { ChainId } from '@dcl/schemas'
import { CreditsService } from 'decentraland-dapps/dist/lib/credits'
import { getConnectedProvider, getNetworkProvider, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { CreditsClient } from 'decentraland-dapps/dist/modules/credits/CreditsClient'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { CreditsNameRouteResponse, CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { TRANSACTION_ACTION_FLAG } from 'decentraland-dapps/dist/modules/transaction/types'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Provider, Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { RouteResponse } from 'decentraland-transactions/crossChain'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { config } from '../../config'
import { DCLRegistrar } from '../../contracts/DCLRegistrar'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'
import { isErrorWithMessage } from '../../lib/error'
import { pollSquidRouteStatus, SquidStatusResponse } from '../../lib/squid'
import { getCrossChainNameProvider } from '../features/selectors'
import { getCurrentIdentity } from '../identity/selectors'
import { getClaimNameWithCreditsRouteUnavailableToast } from '../toast/toasts'
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
  claimNameWithCreditsTransactionSubmitted,
  claimNameWithCreditsCrossChainPolling
} from './actions'
import { ENS, ENSError } from './types'
import { getDomainFromName, PRICE_IN_WEI } from './utils'

export const CONTROLLER_V2_ADDRESS = config.get('CONTROLLER_V2_CONTRACT_ADDRESS', '')
export const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')
export const CORAL_SCAN_BASE_URL = 'https://coralscan.squidrouter.com/tx'

/**
 * Helper function to get the tokenId from the DCLRegistrar contract on Ethereum.
 * This is extracted as a separate function to make it easier to mock in tests.
 */
export async function getTokenIdFromEthereumContract(name: string): Promise<BigNumber> {
  const ethereumProvider = await getNetworkProvider(ChainId.ETHEREUM_MAINNET)
  const provider = new ethers.providers.Web3Provider(ethereumProvider)
  const dclRegistrarContract = DCLRegistrar__factory.connect(REGISTRAR_ADDRESS, provider)
  return dclRegistrarContract.getTokenId(name)
}

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

      // Crypto-paid claim (NOT credits) — always uses Axelar/Squid. The user signs
      // the bridge tx themselves with their own MANA, so the Across V4 alternative
      // doesn't apply (there's no executor in the middle to refactor). The credits-paid
      // saga below is where we branch on `provider`.
      const crossChainModule = (yield import(
        'decentraland-transactions/crossChain'
      )) as typeof import('decentraland-transactions/crossChain')
      const crossChainProvider = new crossChainModule.AxelarProvider(config.get('SQUID_API_URL'))

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

      // Get route from backend using CreditsClient
      const identity: AuthIdentity | null = yield select(getCurrentIdentity)
      if (!identity) {
        throw new Error('No identity available for signed fetch')
      }

      // Pick the bridge provider based on the feature flag variant.
      // The credits-server returns Axelar/Squid (CORAL) or Across V4 calldata
      // depending on the ?provider query param.
      const providerName: ReturnType<typeof getCrossChainNameProvider> = yield select(getCrossChainNameProvider)
      console.log('[NAME-CLAIM] Starting credits-paid claim', {
        name,
        wallet: wallet.address,
        chainId: ChainId.MATIC_MAINNET,
        provider: providerName,
        creditsTotal: credits.totalCredits,
        creditsCount: credits.credits?.length
      })

      const creditsServerUrl = config.get('CREDITS_SERVER_URL')
      const creditsClient = new CreditsClient(creditsServerUrl, { identity })
      let routeData: CreditsNameRouteResponse & { provider?: 'axelar' | 'across' }
      console.log('[NAME-CLAIM] Requesting route from credits-server', {
        url: creditsServerUrl,
        provider: providerName,
        name,
        chainId: ChainId.MATIC_MAINNET
      })
      try {
        if (providerName === 'across') {
          // CreditsClient.fetchCreditsNameRoute doesn't expose a `provider` param yet,
          // so we hit the endpoint directly here. Once dapps adds the param this can
          // be simplified.
          routeData = (yield call(
            fetchCreditsNameRouteWithProvider,
            creditsServerUrl,
            identity,
            name,
            ChainId.MATIC_MAINNET,
            'across'
          )) as CreditsNameRouteResponse & { provider: 'across' }
        } else {
          routeData = (yield call([creditsClient, 'fetchCreditsNameRoute'], name, ChainId.MATIC_MAINNET)) as CreditsNameRouteResponse
        }
        console.log('[NAME-CLAIM] Route received from credits-server', {
          provider: (routeData as any).provider || 'axelar',
          target: routeData.externalCall?.target,
          selector: routeData.externalCall?.selector,
          dataLength: routeData.externalCall?.data?.length,
          expiresAt: routeData.externalCall?.expiresAt,
          salt: routeData.externalCall?.salt,
          quoteId: routeData.quoteId,
          estimatedRouteDurationSec: routeData.estimatedRouteDuration,
          fromChainId: routeData.fromChainId,
          toChainId: routeData.toChainId
        })
      } catch (routeError) {
        console.error('[NAME-CLAIM] Failed to fetch route', { error: routeError, provider: providerName })
        captureException(routeError, { tags: { saga: 'handleClaimNameWithCreditsRequest', phase: 'fetch-route', provider: providerName } })
        const routeUnavailableMessage = t('toast.claim_name_with_credits_route_unavailable.body')
        yield put(showToast(getClaimNameWithCreditsRouteUnavailableToast()))
        // Keep the modal open and surface the failure view (with retry) instead of
        // closing — the failed creditsClaimProgress drives the modal's failed state.
        yield put(claimNameWithCreditsFailure(name, routeUnavailableMessage))
        return
      }

      console.log('[NAME-CLAIM] Submitting useCredits tx on Polygon', {
        provider: (routeData as any).provider,
        externalCallTarget: routeData.externalCall.target,
        externalCallSelector: routeData.externalCall.selector
      })

      const creditsService = new CreditsService()
      const txHash = (yield call(
        [creditsService, 'useCreditsWithExternalCall'],
        PRICE_IN_WEI,
        credits.credits,
        ChainId.MATIC_MAINNET,
        routeData.externalCall,
        routeData.customExternalCallSignature
      )) as string
      console.log('[NAME-CLAIM] useCredits tx submitted', {
        txHash,
        polygonscanUrl: `https://polygonscan.com/tx/${txHash}`
      })

      // Dispatch transaction submitted action (registers the tx for tracking)
      yield put(claimNameWithCreditsTransactionSubmitted(name, wallet.address, ChainId.MATIC_MAINNET, txHash))

      // The origin-tx link: Across's explorer has no reliable public deep-link for a single
      // deposit (the /transactions/<hash> route 404s), so for Across we link the origin tx on
      // Polygonscan, which always resolves. Squid keeps using CoralScan.
      const isAcross = routeData.provider === 'across' || providerName === 'across'
      const scanUrl = isAcross ? `https://polygonscan.com/tx/${txHash}` : `${CORAL_SCAN_BASE_URL}/${txHash}`

      // Stage 1 — "consuming credits": the origin (Polygon) tx is mining.
      yield put(claimNameWithCreditsCrossChainPolling(name, txHash, scanUrl, 'consuming'))

      // Wait for the Polygon useCredits tx to actually mine BEFORE moving to the next stage.
      // If it reverts (e.g. the executor's Chainlink staleness check, an InvalidTarget, etc.),
      // no bridge deposit was ever made — surface a friendly failure instead of a stuck tracker.
      // waitForTx throws on a reverted/failed tx.
      try {
        yield call(waitForTx, txHash)
      } catch (txError) {
        console.error('[NAME-CLAIM] useCredits tx reverted on Polygon — no bridge deposit was made', {
          txHash,
          error: txError
        })
        captureException(txError, {
          tags: { saga: 'handleClaimNameWithCreditsRequest', phase: 'wait-polygon-tx', provider: providerName }
        })
        yield put(showToast(getClaimNameWithCreditsRouteUnavailableToast()))
        yield put(claimNameWithCreditsFailure(name, t('toast.claim_name_with_credits_route_unavailable.body')))
        return
      }

      // Stage 2 — "registering NAME": origin tx confirmed; now bridging + registering on destination.
      yield put(claimNameWithCreditsCrossChainPolling(name, txHash, scanUrl, 'registering'))

      // Get Squid Router API configuration (only used in the Axelar path)
      const squidRouterApiUrl = config.get('REACT_APP_SQUID_ROUTER_API_URL', 'https://v2.api.squidrouter.com')
      const squidIntegratorId = config.get('REACT_APP_SQUID_INTEGRATOR_ID', 'decentraland-sdk-coral-test')

      try {
        let ethereumTxHash: string
        if (isAcross) {
          console.log('[NAME-CLAIM] Polling Across status', { txHash, scanUrl })
          // Poll Across status until the deposit reaches a terminal state.
          const acrossResult: { destinationTxHash: string | null; status: string; actionsSucceeded: boolean } = (yield call(
            pollAcrossRouteStatus,
            txHash
          )) as {
            destinationTxHash: string | null
            status: string
            actionsSucceeded: boolean
          }
          console.log('[NAME-CLAIM] Across polling resolved', acrossResult)
          // Success requires BOTH a fill AND the destination actions (the register) to
          // have succeeded. A filled deposit whose actions reverted means the bridged MANA
          // went to the recovery wallet and the NAME was NOT minted — treat as failure.
          if (acrossResult.status !== 'filled' || !acrossResult.actionsSucceeded) {
            throw new Error(
              `Across delivery did not complete the registration (status: ${acrossResult.status}, actionsSucceeded: ${acrossResult.actionsSucceeded})`
            )
          }
          // The fill hash is the Ethereum-side tx; fall back to the origin tx for the tokenId lookup.
          ethereumTxHash = acrossResult.destinationTxHash || txHash
        } else {
          console.log('[NAME-CLAIM] Polling Squid status', {
            txHash,
            fromChainId: routeData.fromChainId,
            toChainId: routeData.toChainId,
            quoteId: routeData.quoteId
          })
          // Poll for cross-chain transaction completion via Squid
          const statusResponse: SquidStatusResponse = yield call(pollSquidRouteStatus, {
            transactionId: txHash,
            fromChainId: routeData.fromChainId,
            toChainId: routeData.toChainId,
            quoteId: routeData.quoteId,
            integratorId: squidIntegratorId,
            apiUrl: squidRouterApiUrl
          })
          console.log('[NAME-CLAIM] Squid polling resolved', {
            squidStatus: (statusResponse as any).squidTransactionStatus,
            ethereumTxHash: statusResponse.toChain?.transactionId
          })
          ethereumTxHash = statusResponse.toChain?.transactionId || txHash
        }
        console.log('[NAME-CLAIM] Destination tx detected', {
          ethereumTxHash,
          etherscanUrl: `https://etherscan.io/tx/${ethereumTxHash}`
        })

        // Get the real tokenId from the DCLRegistrar contract on Ethereum
        // The polling success means the Ethereum tx is confirmed, so we can query the contract
        const tokenId: BigNumber = (yield call(getTokenIdFromEthereumContract, name)) as BigNumber

        // Create ENS object with the real tokenId
        const ens: ENS = {
          name,
          tokenId: tokenId.toString(),
          ensOwnerAddress: wallet.address,
          nftOwnerAddress: wallet.address,
          subdomain: getDomainFromName(name),
          resolver: ethers.constants.AddressZero,
          content: ethers.constants.AddressZero,
          contractAddress: REGISTRAR_ADDRESS
        }

        // Dispatch success action with the Ethereum transaction hash. The modal stays open
        // and shows the success view (the saga no longer force-closes it).
        yield put(claimNameWithCreditsSuccess(ens, name, ethereumTxHash))
      } catch (pollingError) {
        captureException(pollingError, { tags: { saga: 'handleClaimNameWithCreditsRequest', phase: 'polling' } })
        // Surface the failure view (with retry) in the modal instead of closing.
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
      captureException(error, { tags: { saga: 'handleClaimNameWithCreditsRequest', phase: 'setup' } })
      yield put(claimNameWithCreditsFailure(name, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
      // Don't close modal here - error will be shown in the modal UI
    }
  }
}

/**
 * Hits the credits-server `/credits-name-route` endpoint with a `provider` query param.
 * The vanilla `CreditsClient.fetchCreditsNameRoute` doesn't expose this param yet —
 * once `decentraland-dapps` updates the client signature, this helper can be removed.
 */
async function fetchCreditsNameRouteWithProvider(
  creditsServerUrl: string,
  identity: AuthIdentity,
  name: string,
  chainId: ChainId,
  provider: 'axelar' | 'across'
): Promise<CreditsNameRouteResponse & { provider: 'axelar' | 'across' }> {
  const url = `${creditsServerUrl}/credits-name-route?name=${encodeURIComponent(name)}&chainId=${chainId}&provider=${provider}`
  // decentraland-crypto-fetch exposes a default-exported signed fetch.
  const signedFetch = (await import('decentraland-crypto-fetch')).default
  const response = await signedFetch(url, { method: 'GET', identity })
  if (!response.ok) {
    throw new Error(`Credits route request failed: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<CreditsNameRouteResponse & { provider: 'axelar' | 'across' }>
}

/**
 * Poll Across status API until we observe the destination tx or a terminal failure.
 * Across exposes the deposit status via their app API: /api/deposit/status?originChainId=137&depositId=<txHash>
 * Status values: 'pending' | 'filled' | 'expired' | 'refunded'
 */
async function pollAcrossRouteStatus(
  originChainTxHash: string
): Promise<{ destinationTxHash: string | null; status: string; actionsSucceeded: boolean }> {
  const apiUrl = config.get('ACROSS_API_URL', 'https://app.across.to/api')
  const maxAttempts = 60 // ~10 min with 10s intervals
  const intervalMs = 10_000

  for (let i = 0; i < maxAttempts; i++) {
    const url = `${apiUrl}/deposit/status?originChainId=137&depositTxHash=${originChainTxHash}`
    const response = await fetch(url)
    if (!response.ok) {
      console.warn('[NAME-CLAIM][ACROSS-POLL] non-ok response, will retry', {
        attempt: i + 1,
        maxAttempts,
        status: response.status,
        statusText: response.statusText
      })
      await new Promise(resolve => setTimeout(resolve, intervalMs))
      continue
    }
    // Across `/deposit/status` returns the destination fill hash as `fillTx` / `fillTxnRef`
    // (NOT `fillTxHash`), and `actionsSucceeded` tells us whether the embedded
    // MulticallHandler actions (approve + register + sweep) ran — i.e. whether the NAME
    // was actually minted. If `actionsSucceeded` is false, the deposit filled but the
    // register reverted and the bridged MANA went to the recovery wallet.
    const data: {
      status?: string
      fillTx?: string
      fillTxnRef?: string
      depositRefundTxHash?: string | null
      actionsSucceeded?: boolean
    } = await response.json()
    const status = (data.status || 'pending').toLowerCase()
    const fillTx = data.fillTx || data.fillTxnRef || null
    const actionsSucceeded = data.actionsSucceeded !== false
    console.log('[NAME-CLAIM][ACROSS-POLL] tick', { attempt: i + 1, status, fillTx, actionsSucceeded })

    if (status === 'filled') {
      // Filled is terminal — resolve regardless of whether the fill hash is present yet.
      return { destinationTxHash: fillTx, status, actionsSucceeded }
    }
    if (status === 'refunded' || status === 'expired') {
      console.warn('[NAME-CLAIM][ACROSS-POLL] terminal failure detected', { status })
      return { destinationTxHash: null, status, actionsSucceeded: false }
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs))
  }
  throw new Error('Across status polling timed out after 10 minutes')
}
