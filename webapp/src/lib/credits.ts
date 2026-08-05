import { TradeAsset, TradeAssetType } from '@dcl/schemas'

/**
 * Display rules for USD-pegged listing prices.
 *
 * A trade whose received asset is `TradeAssetType.USD_PEGGED_MANA` is priced in **USD wei**
 * (1e18 = $1), not in MANA wei. Feeding that amount through `formatWeiMANA` /
 * `formatWeiToAssetCard` (and then through `ManaToFiat`) does not produce a slightly-wrong
 * number — it produces a meaningless one, off by the MANA price. A $0.60 listing rendered as
 * MANA reads as "◈ 0.6 ($0.04)" instead of the 6 credits the buyer is actually charged.
 *
 * The peg and the rounding here mirror the shop app (its `lib/currency.ts` and
 * `lib/mana-convert.ts`) on purpose: a price that disagrees between the two apps is the bug
 * this module exists to close. Deliberately duplicated rather than shared as a dependency —
 * the two apps do not depend on each other.
 */

/** THE PEG. One credit is a fixed 10 US cents. */
export const USD_CENTS_PER_CREDIT = 10

/** USD here is 18-decimal wei, so one cent is 1e16. */
export const USD_WEI_PER_CENT = 10n ** 16n

/** Derived from the peg rather than restating it: today 1e17, and it follows if the peg moves. */
export const USD_WEI_PER_CREDIT = BigInt(USD_CENTS_PER_CREDIT) * USD_WEI_PER_CENT

/** True when this trade asset's `amount` is USD wei rather than MANA wei. */
export function isUSDPeggedTradeAsset(asset?: Pick<TradeAsset, 'assetType'> | null): boolean {
  return asset?.assetType === TradeAssetType.USD_PEGGED_MANA
}

/**
 * USD wei (1e18 = $1) → whole credits, rounded **UP** so the shown price never sits below what
 * checkout charges, floored at 1 credit. Returns `null` on a malformed amount so callers can show
 * "price unavailable" instead of a fake "1 credit". BigInt throughout, so no float drift on large
 * amounts.
 */
export function usdWeiToCredits(usdWei: string): number | null {
  // `BigInt('')` is 0n, which would silently become "1 credit". An absent amount is not a price.
  if (!usdWei || !usdWei.trim()) {
    return null
  }
  let wei: bigint
  try {
    wei = BigInt(usdWei)
  } catch {
    return null
  }
  if (wei < 0n) {
    return null
  }
  const whole = wei / USD_WEI_PER_CREDIT
  const credits = wei % USD_WEI_PER_CREDIT > 0n ? whole + 1n : whole
  const n = Number(credits)
  return n < 1 ? 1 : n
}

/** Credits → US dollars. Exact: a credit is a whole number of cents, so nothing is lost. */
export function creditsToUsd(credits: number): number {
  return (credits * USD_CENTS_PER_CREDIT) / 100
}

const compactFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 2
})

/**
 * Compact credit amount for tight spaces: 500 → "500", 12_000 → "12K", 5_500_000 → "5.5M".
 * Mirrors `formatWeiToAssetCard` (Intl compact, 2 fraction digits) so credit prices read the same
 * as MANA prices do elsewhere. Pair with `formatCreditsFull` in a tooltip, since this is lossy.
 */
export function formatCredits(credits: number): string {
  return compactFormatter.format(credits)
}

/** Full grouped amount for tooltips / exact contexts: 5_500_000 → "5,500,000". */
export function formatCreditsFull(credits: number): string {
  return credits.toLocaleString('en')
}

/** The dollar equivalent of a credit amount, for the secondary line: 6 → "$0.60". */
export function formatCreditsAsUsd(credits: number): string {
  return `$${creditsToUsd(credits).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}
