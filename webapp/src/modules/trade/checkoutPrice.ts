import { ChainId } from '@dcl/schemas'
import { PriceDenomination, fetchTradePricing } from './denomination'
import { fetchManaUsdRate, usdWeiToManaWei } from './manaRate'

export type CheckoutPriceInMana = {
  /** MANA wei to charge, or null when it could not be resolved. */
  manaWei: string | null
  /** True once the trade is known to be USD-pegged, so callers can mark the figure as an approximation. */
  isUSDPegged: boolean
}

/** Frozen: it is handed out by reference, and a caller mutating it would corrupt every later call. */
const UNRESOLVED: CheckoutPriceInMana = Object.freeze({ manaWei: null, isUSDPegged: false })

/**
 * How much MANA a listing costs, given a `price` that may be MANA wei or USD wei.
 *
 * The catalog and order endpoints return `price` with no unit attached, so the trade behind it is the only
 * thing that says what the number means, and a USD-pegged one is converted through the aggregator of the
 * marketplace it was signed against — the same one that converts it at accept time.
 *
 * A null `manaWei` means the amount is not known: either the trade could not be read (which
 * `fetchTradePricing` reports as a null `marketplaceAddress`, since its denomination falls back to MANA for
 * the benefit of price labels) or the rate could not be. Callers that turn this into a charge, a threshold or
 * a quote have to handle that rather than reach for `price`, because the two denominations differ by the
 * whole MANA/USD rate.
 *
 * Listings with no `tradeId` (legacy on-chain orders, collection-store mints) are MANA by construction.
 */
export async function resolveCheckoutPriceInMana(
  price: string,
  chainId: ChainId | undefined,
  tradeId?: string
): Promise<CheckoutPriceInMana> {
  if (!tradeId) {
    return { manaWei: price, isUSDPegged: false }
  }

  const { denomination, marketplaceAddress } = await fetchTradePricing(tradeId)
  if (!marketplaceAddress) {
    return UNRESOLVED
  }
  if (denomination === PriceDenomination.MANA) {
    return { manaWei: price, isUSDPegged: false }
  }
  if (!chainId) {
    return { ...UNRESOLVED, isUSDPegged: true }
  }

  const rate = await fetchManaUsdRate(chainId, marketplaceAddress)
  return { manaWei: usdWeiToManaWei(price, rate), isUSDPegged: true }
}
