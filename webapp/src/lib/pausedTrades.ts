import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from './error'

// Orders, bids, items and trades flag listings settled by a paused marketplace contract.
export type Pausable = { paused?: boolean } | null | undefined

export const PAUSED_TRADE_ERROR = 'The marketplace contract of this listing is paused'

// 0xd93c0665 is the selector of OpenZeppelin's EnforcedPause() custom error.
const PAUSED_REVERT_PATTERNS = [/pausable: paused/i, /enforcedpause/i, /0xd93c0665/i]

export class PausedTradeError extends Error {
  constructor() {
    super(PAUSED_TRADE_ERROR)
    this.name = 'PausedTradeError'
  }
}

export function isPaused(entity: Pausable): boolean {
  return !!entity && entity.paused === true
}

export function assertNotPaused(...entities: Pausable[]): void {
  if (entities.some(isPaused)) {
    throw new PausedTradeError()
  }
}

// A bid on a paused contract can't be accepted, so it doesn't stop its bidder from making a new one.
export function hasActiveBidFrom(bids: ({ bidder: string } & NonNullable<Pausable>)[], address: string | null | undefined): boolean {
  return !!address && bids.some(bid => bid.bidder === address && !isPaused(bid))
}

function collectErrorTexts(error: unknown, depth = 0): string[] {
  if (depth > 3 || error === null || error === undefined) return []
  if (typeof error === 'string') return [error]
  if (typeof error !== 'object') return []
  const { message, reason, data, error: nested } = error as Record<string, unknown>
  return [
    ...(typeof message === 'string' ? [message] : []),
    ...(typeof reason === 'string' ? [reason] : []),
    ...collectErrorTexts(data, depth + 1),
    ...collectErrorTexts(nested, depth + 1)
  ]
}

// True for the client-side guard and for on-chain reverts of a paused contract.
export function isPausedTradeError(error: unknown): boolean {
  if (error instanceof PausedTradeError) return true
  return collectErrorTexts(error).some(text => PAUSED_REVERT_PATTERNS.some(pattern => pattern.test(text)))
}

export function getPausedTradeErrorMessage(): string {
  return t('trading_paused_warning.error')
}

export function isPausedTradeErrorMessage(message: string | null | undefined): boolean {
  return !!message && message === getPausedTradeErrorMessage()
}

// Maps a failure to the message the sagas report, replacing paused reverts with friendly copy.
export function getTradeFailureMessage(error: unknown, fallback: string): string {
  if (isPausedTradeError(error)) return getPausedTradeErrorMessage()
  return isErrorWithMessage(error) ? error.message : fallback
}
