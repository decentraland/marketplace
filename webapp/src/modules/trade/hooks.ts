import { useEffect, useState } from 'react'
import { ChainId } from '@dcl/schemas'
import { PriceDenomination, fetchTradePriceDenomination } from './denomination'
import { ManaUsdRate, fetchManaUsdRate } from './manaRate'

/**
 * How the given trade-backed listing is priced, for components that render a `price`.
 *
 * Starts at `MANA` and settles to `USD_PEGGED` once the trade says so. That optimistic start is
 * deliberate: the overwhelming majority of listings are MANA, and MANA is what every price already
 * renders as today, so the first paint is unchanged for them and only the USD-pegged minority
 * re-renders. Listings without a `tradeId` (legacy on-chain orders, collection-store mints) are
 * always MANA and never trigger a request.
 */
export function useTradePriceDenomination(tradeId?: string): PriceDenomination {
  const [denomination, setDenomination] = useState(PriceDenomination.MANA)

  useEffect(() => {
    if (!tradeId) {
      setDenomination(PriceDenomination.MANA)
      return
    }

    let cancelled = false
    void fetchTradePriceDenomination(tradeId).then(resolved => {
      if (!cancelled) {
        setDenomination(resolved)
      }
    })

    return () => {
      cancelled = true
    }
  }, [tradeId])

  return denomination
}

/** Where a rate read has got to. `pending` is the answer not being in yet; `unavailable` is not getting one. */
export type ManaUsdRateState =
  | { status: 'pending'; rate: null }
  | { status: 'ready'; rate: ManaUsdRate }
  | { status: 'unavailable'; rate: null }

const PENDING = { status: 'pending', rate: null } as const
const UNAVAILABLE = { status: 'unavailable', rate: null } as const

/**
 * The MANA/USD rate for a chain, as a state rather than a nullable value.
 *
 * "Still reading" and "cannot be read" are different facts, and collapsing them into `null` made every
 * caller state the wrong one: a price would announce itself unavailable for the frame before its first
 * read landed, which on a grid is one such flash per card. Without the rate there is still no honest MANA
 * figure to show — that part was right — but a pending read is not a failure, and only the second deserves
 * to be said out loud.
 */
export function useManaUsdRate(chainId?: ChainId): ManaUsdRateState {
  const [state, setState] = useState<ManaUsdRateState>(PENDING)

  useEffect(() => {
    if (!chainId) {
      // No chain to read against is a dead end, not a wait: nothing is coming.
      setState(UNAVAILABLE)
      return
    }

    let cancelled = false
    // Back to pending first: on a chain switch the previous chain's rate would otherwise linger until the
    // new read resolves, briefly pricing a listing at another network's rate.
    setState(PENDING)
    void fetchManaUsdRate(chainId)
      .then(resolved => {
        if (!cancelled) {
          setState({ status: 'ready', rate: resolved })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState(UNAVAILABLE)
        }
      })

    return () => {
      cancelled = true
    }
  }, [chainId])

  return state
}
