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

/**
 * The MANA/USD rate for a chain, or `null` while it is being read (or if the oracle cannot be reached).
 *
 * A null result is a real state, not a loading detail to paper over: without the rate there is no honest MANA
 * figure to show for a USD-pegged listing, so the caller renders "price unavailable" instead of guessing.
 */
export function useManaUsdRate(chainId?: ChainId): ManaUsdRate | null {
  const [rate, setRate] = useState<ManaUsdRate | null>(null)

  useEffect(() => {
    if (!chainId) {
      setRate(null)
      return
    }

    let cancelled = false
    void fetchManaUsdRate(chainId)
      .then(resolved => {
        if (!cancelled) {
          setRate(resolved)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRate(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [chainId])

  return rate
}
