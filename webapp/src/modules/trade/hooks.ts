import { useEffect, useState } from 'react'
import { PriceDenomination, fetchTradePriceDenomination } from './denomination'

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
