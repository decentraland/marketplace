import { useEffect, useMemo, useState } from 'react'
import { ChainId, Network } from '@dcl/schemas'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib/eth'
import { PriceDenomination, TradePricing, fetchTradePricing } from './denomination'
import { ManaUsdRate, fetchManaUsdRate, usdWeiToManaWei } from './manaRate'

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

/**
 * The MANA a checkout should charge for a listing.
 *
 * `ready` carries the figure to use for the price, the balance check, the allowance and the total.
 * `resolving` and `unavailable` carry none, because the amount is not known yet (or at all).
 */
export type CheckoutPrice =
  /** The trade is still being read; there is no amount yet. */
  | { status: 'resolving'; manaWei: null; isUSDPegged: boolean }
  /** `manaWei` is the amount to charge: the price to show, the balance to check, the allowance to ask for. */
  | { status: 'ready'; manaWei: string; isUSDPegged: boolean }
  /** The amount could not be determined, so there is none to act on. */
  | { status: 'unavailable'; manaWei: null; isUSDPegged: boolean }

const RESOLVING: CheckoutPrice = { status: 'resolving', manaWei: null, isUSDPegged: false }
const UNAVAILABLE: CheckoutPrice = { status: 'unavailable', manaWei: null, isUSDPegged: false }

/** `getChainIdByNetwork` throws when the app config is not initialised; a missing chain is an unpriceable listing. */
function chainIdOf(network: Network): ChainId | undefined {
  try {
    return getChainIdByNetwork(network)
  } catch {
    return undefined
  }
}

/**
 * How much MANA to charge for a listing whose `price` may be MANA wei or USD wei.
 *
 * The catalog and order endpoints return `price` with no unit attached, so the trade behind it is the only
 * thing that says what the number means. Price LABELS resolve that through {@link useTradePricing}; this is
 * the same resolution for the checkout figures, and it differs from the label one in two ways:
 *
 * 1. It has no optimistic start. The label hook begins at MANA so the common case paints immediately and only
 *    the pegged minority re-renders; here that first paint would already be a number the buyer acts on, so a
 *    trade-backed listing stays `resolving` until the trade has answered.
 * 2. A trade that could not be read resolves to `unavailable` rather than to MANA. `fetchTradePricing` reports
 *    that as a null `marketplaceAddress` (its denomination falls back to MANA, which is right for a label and
 *    not for an amount), and the two denominations differ by the MANA/USD rate.
 *
 * Listings with no `tradeId` (legacy on-chain orders, collection-store mints) are MANA by construction and
 * resolve synchronously, with no request and no intermediate state.
 */
export function useCheckoutPriceInMana(price: string, network: Network, tradeId?: string): CheckoutPrice {
  const untradedPrice = useMemo<CheckoutPrice>(() => ({ status: 'ready', manaWei: price, isUSDPegged: false }), [price])
  const [resolved, setResolved] = useState<CheckoutPrice>(RESOLVING)

  useEffect(() => {
    if (!tradeId) {
      return
    }

    let cancelled = false
    setResolved(RESOLVING)

    const resolve = async (): Promise<CheckoutPrice> => {
      const { denomination, marketplaceAddress } = await fetchTradePricing(tradeId)
      if (!marketplaceAddress) {
        return UNAVAILABLE
      }
      if (denomination === PriceDenomination.MANA) {
        return { status: 'ready', manaWei: price, isUSDPegged: false }
      }

      const chainId = chainIdOf(network)
      if (!chainId) {
        return { ...UNAVAILABLE, isUSDPegged: true }
      }

      // Read through the marketplace the trade was signed against, the same one that will convert the amount
      // at accept time, so this is the settlement figure at read time. It moves before the buyer confirms,
      // which is why callers label it approximate.
      const rate = await fetchManaUsdRate(chainId, marketplaceAddress)
      const manaWei = usdWeiToManaWei(price, rate)
      return manaWei === null ? { ...UNAVAILABLE, isUSDPegged: true } : { status: 'ready', manaWei, isUSDPegged: true }
    }

    void resolve()
      .catch(() => UNAVAILABLE)
      .then(next => {
        if (!cancelled) {
          setResolved(next)
        }
      })

    return () => {
      cancelled = true
    }
  }, [tradeId, price, network])

  return tradeId ? resolved : untradedPrice
}
