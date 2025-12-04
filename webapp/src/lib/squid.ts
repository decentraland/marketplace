/**
 * Squid Router API utilities for cross-chain transaction status polling
 */

export enum SquidTransactionStatus {
  SUCCESS = 'success',
  NEEDS_GAS = 'needs_gas',
  ONGOING = 'ongoing',
  PARTIAL_SUCCESS = 'partial_success',
  NOT_FOUND = 'not_found',
  REFUND_STATUS = 'refund'
}

export interface SquidStatusResponse {
  id: string
  status: string
  gasStatus: string
  isGMPTransaction: boolean
  squidTransactionStatus: SquidTransactionStatus
  axelarTransactionUrl: string
  fromChain: {
    transactionId: string
    blockNumber: string
    callEventStatus: string
    callEventLog: any[]
    chainData: any
    transactionUrl: string
  }
  toChain: {
    transactionId: string
    blockNumber: string
    callEventStatus: string
    callEventLog: any[]
    chainData: any
    transactionUrl: string
  }
  timeSpent: {
    total: number
  }
  routeStatus: Array<{
    chainId: string
    txHash: string
    status: string
    action: string
  }>
  error?: any
  requestId?: string
  integratorId?: string
}

export interface PollSquidRouteStatusParams {
  transactionId: string
  fromChainId: string
  toChainId: string
  quoteId: string
  integratorId: string
  apiUrl: string
}

const POLLING_INTERVAL_MS = 5000 // 5 seconds
const MAX_POLLING_TIME_MS = 15 * 60 * 1000 // 15 minutes
const MAX_POLLING_ATTEMPTS = Math.ceil(MAX_POLLING_TIME_MS / POLLING_INTERVAL_MS) // 180 attempts (15 minutes)

/**
 * Polls Squid Router API for cross-chain transaction status
 * @param params - Polling parameters
 * @returns Promise that resolves when transaction is successful or rejects on error/timeout
 */
export async function pollSquidRouteStatus(params: PollSquidRouteStatusParams): Promise<SquidStatusResponse> {
  const { transactionId, fromChainId, toChainId, quoteId, integratorId, apiUrl } = params

  const startTime = Date.now()
  let lastStatus: SquidTransactionStatus | null = null
  let attempts = 0

  for (attempts = 0; attempts < MAX_POLLING_ATTEMPTS; attempts++) {
    const elapsedTime = Date.now() - startTime

    // Check timeout (redundant but kept as safety check)
    if (elapsedTime > MAX_POLLING_TIME_MS) {
      throw new Error('Cross-chain transaction polling timeout. Please check the Activity page for transaction status.')
    }

    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        transactionId,
        fromChainId,
        toChainId,
        quoteId
      })

      const url = `${apiUrl}/v2/status?${queryParams.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-integrator-id': integratorId,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new Error(`Squid API error: ${errorData.error || response.statusText}`)
      }

      const data: SquidStatusResponse = await response.json()
      const currentStatus = data.squidTransactionStatus

      // Log status change
      if (currentStatus !== lastStatus) {
        lastStatus = currentStatus
      }

      // Handle different statuses
      switch (currentStatus) {
        case SquidTransactionStatus.SUCCESS:
          return data

        case SquidTransactionStatus.NEEDS_GAS:
          throw new Error('Transaction needs additional gas on destination chain. Please check Axelarscan for details.')

        case SquidTransactionStatus.PARTIAL_SUCCESS:
          throw new Error('Transaction partially completed. You may have received bridged tokens. Please check the Activity page.')

        case SquidTransactionStatus.REFUND_STATUS:
          throw new Error('Transaction failed and funds were refunded to your wallet.')

        case SquidTransactionStatus.ONGOING:
          // Continue polling
          break

        case SquidTransactionStatus.NOT_FOUND:
          // If we've been polling for a while and still not found, it's an error
          if (elapsedTime > 60000) {
            // 1 minute
            throw new Error('Transaction not found. The transaction may not have been properly submitted.')
          }
          // Otherwise, just continue polling (indexing might be slow)
          break

        default:
          // Unknown status, continue polling
          break
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS))
    } catch (error) {
      // If it's one of our custom errors, re-throw it
      if (error instanceof Error && error.message.includes('Squid')) {
        throw error
      }

      // For network errors, log and retry
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS))
    }
  }

  // If we've exhausted all attempts
  throw new Error('Cross-chain transaction polling timeout. Please check the Activity page for transaction status.')
}
