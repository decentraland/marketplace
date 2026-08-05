import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { ContractName, getContract } from 'decentraland-transactions'

/**
 * The MANA/USD rate a USD-pegged listing will actually settle at.
 *
 * A `USD_PEGGED_MANA` trade prices the item in USD, and the marketplace contract converts that to MANA at
 * accept time using its own oracle. This app charges in MANA, so the only honest thing to show a buyer is how
 * much MANA the listing currently costs — not the USD figure, and certainly not a shop-side unit.
 *
 * READ THROUGH THE MARKETPLACE, NEVER A STANDALONE ORACLE. `decentraland-transactions` also ships a
 * `ChainlinkOracle` entry, and on Polygon it is a DIFFERENT contract from the one the marketplace settles with
 * (`0xe18B1361…` vs the marketplace's `0xA1CbF3Fe…`, measured on chain — and the marketplace's does not even
 * expose `getRate`). Reading the aggregator address off the marketplace itself makes the displayed rate the
 * settlement rate by construction, instead of two numbers that happen to agree until they don't.
 */

const MARKETPLACE_ABI = ['function manaUsdAggregator() view returns (address)']
const AGGREGATOR_ABI = [
  'function decimals() view returns (uint8)',
  'function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)'
]

export type ManaUsdRate = {
  /** The oracle answer, in `decimals` fixed-point. USD per MANA. */
  answer: bigint
  decimals: number
}

/**
 * How long a read is reused. Short on purpose: this is a live price, and a stale one shown next to a Buy
 * button is the thing we are trying to avoid. Long enough that a grid of cards costs one read, not thirty.
 */
const TTL_MS = 60_000

type CacheEntry = { at: number; rate: Promise<ManaUsdRate> }
const cache = new Map<ChainId, CacheEntry>()

async function readRate(chainId: ChainId): Promise<ManaUsdRate> {
  const provider = await getNetworkProvider(chainId)
  if (!provider) {
    throw new Error('Could not get a provider to read the MANA/USD oracle')
  }
  const web3 = new ethers.providers.Web3Provider(provider)
  const { address } = getContract(ContractName.OffChainMarketplaceV2, chainId)
  const marketplace = new ethers.Contract(address, MARKETPLACE_ABI, web3)
  const aggregatorAddress: string = await marketplace.manaUsdAggregator()

  const aggregator = new ethers.Contract(aggregatorAddress, AGGREGATOR_ABI, web3)
  const [decimals, round] = await Promise.all([aggregator.decimals(), aggregator.latestRoundData()])

  // `latestRoundData` answers a 5-tuple and the rate is at index 1. Read defensively rather than asserting a
  // shape: if the decode ever changes (an ethers major, a different feed), an explicit throw beats a cast that
  // quietly yields something unusable, because the result of this read is a PRICE.
  const raw: unknown = Array.isArray(round) ? round[1] : undefined
  if (raw === null || raw === undefined) {
    throw new Error('The MANA/USD oracle returned no rate')
  }
  const answer = BigInt(String(raw))
  if (answer <= 0n) {
    throw new Error('The MANA/USD oracle returned a non-positive rate')
  }
  return { answer, decimals: Number(decimals) }
}

/** The rate for a chain, cached for {@link TTL_MS}. A failed read is not cached. */
export function fetchManaUsdRate(chainId: ChainId): Promise<ManaUsdRate> {
  const hit = cache.get(chainId)
  if (hit && Date.now() - hit.at < TTL_MS) {
    return hit.rate
  }
  const rate = readRate(chainId).catch(error => {
    // Never pin a failure: the next render should try again rather than inherit a broken price for a minute.
    cache.delete(chainId)
    throw error
  })
  cache.set(chainId, { at: Date.now(), rate })
  return rate
}

/** Test seam — the cache is module state, so specs have to be able to empty it. */
export function clearManaUsdRateCache(): void {
  cache.clear()
}

/**
 * USD wei (1e18 = $1) → MANA wei, at the given rate.
 *
 * `manaWei = usdWei * 10^decimals / answer`, the same arithmetic the contract performs, in BigInt so a large
 * listing does not drift through a float. Returns `null` on a malformed amount so a caller can say "price
 * unavailable" rather than render a confident zero.
 *
 * Truncating (rather than rounding up) is deliberate for DISPLAY: the contract computes the real figure at
 * accept time, and a shown value a hair under the charge is honest once it is labelled approximate — whereas
 * inflating it would have buyers believe the listing costs more than it does.
 */
export function usdWeiToManaWei(usdWei: string, rate: ManaUsdRate): string | null {
  if (!usdWei || !usdWei.trim()) {
    return null
  }
  let usd: bigint
  try {
    usd = BigInt(usdWei)
  } catch {
    return null
  }
  if (usd < 0n) {
    return null
  }
  // `fetchManaUsdRate` already refuses a non-positive answer, but this function is exported and takes a rate
  // from any caller — so guard the divisor here too rather than letting a hand-built rate throw a RangeError
  // out of a render.
  if (rate.answer <= 0n) {
    return null
  }
  return ((usd * 10n ** BigInt(rate.decimals)) / rate.answer).toString()
}
