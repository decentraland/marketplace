import { useEffect, useState } from 'react'
import { ChainId } from '@dcl/schemas'
import { PriceDenomination, TradePricing, fetchTradePricing } from './denomination'
import { ManaUsdRate, fetchManaUsdRate } from './manaRate'

const MANA_PRICING: TradePricing = { denomination: PriceDenomination.MANA, marketplaceAddress: null }

/**
 * How the given trade-backed listing is priced, for components that render a `price`.
 *
 * Starts at `MANA` and settles to `USD_PEGGED` once the trade says so. That optimistic start is
 * deliberate: the overwhelming majority of listings are MANA, and MANA is what every price already
 * renders as today, so the first paint is unchanged for them and only the USD-pegged minority
 * re-renders. Listings without a `tradeId` (legacy on-chain orders, collection-store mints) are
 * always MANA and never trigger a request.
 */
export function useTradePricing(tradeId?: string): TradePricing {
  const [pricing, setPricing] = useState<TradePricing>(MANA_PRICING)

  useEffect(() => {
    if (!tradeId) {
      setPricing(MANA_PRICING)
      return
    }

    let cancelled = false
    void fetchTradePricing(tradeId).then(resolved => {
      if (!cancelled) {
        setPricing(resolved)
      }
    })

    return () => {
      cancelled = true
    }
  }, [tradeId])

  return pricing
}

/**
 * The MANA/USD rate for a chain, or `null` while it is being read (or if the oracle cannot be reached).
 *
 * A null result is a real state, not a loading detail to paper over: without the rate there is no honest MANA
 * figure to show for a USD-pegged listing, so the caller renders "price unavailable" instead of guessing.
 */
export function useManaUsdRate(chainId?: ChainId, marketplaceAddress?: string | null): ManaUsdRate | null {
  const [rate, setRate] = useState<ManaUsdRate | null>(null)

  useEffect(() => {
    // No settlement contract means no honest rate to read — the caller renders "price unavailable" rather
    // than falling back to a version this listing may not have been signed against.
    if (!chainId || !marketplaceAddress) {
      setRate(null)
      return
    }

    let cancelled = false
    // Clear first: on a chain switch the previous chain's rate would otherwise linger until the new read
    // resolves, briefly pricing a listing at another network's rate.
    setRate(null)
    void fetchManaUsdRate(chainId, marketplaceAddress)
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
  }, [chainId, marketplaceAddress])

  return rate
}
