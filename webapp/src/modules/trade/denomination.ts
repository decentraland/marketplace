import { Trade, TradeAsset, TradeAssetType } from '@dcl/schemas'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { API_SIGNER } from '../../lib/api'
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland/marketplace/api'

/**
 * How a listing's `price` field is denominated.
 *
 * The catalog/items/orders endpoints return `price` as a bare wei string with no unit attached, and
 * neither `Item` nor `Order` in `@dcl/schemas` carries a denomination flag (verified against 26.0.0
 * and 27.0.0). The only thing that says which unit a listing is priced in is its trade's received
 * asset type, so the trade has to be read to render the price honestly.
 */
export enum PriceDenomination {
  /** `price` is MANA wei. Render with the MANA glyph. */
  MANA = 'mana',
  /** `price` is USD wei (1e18 = $1). Render in credits. */
  USD_PEGGED = 'usd-pegged'
}

/**
 * Trades are immutable once signed — the signature pins `received`, so the asset type can never
 * change for a given id. That makes an unbounded process-lifetime cache safe, and it keeps a list of
 * rows sharing a trade (or a revisited detail page) down to a single request.
 */
const cache = new Map<string, Promise<PriceDenomination>>()

function buildService(): TradeService {
  return new TradeService(API_SIGNER, MARKETPLACE_SERVER_URL, () => undefined)
}

/** True when this trade asset's `amount` is USD wei rather than MANA wei. */
function isUSDPeggedTradeAsset(asset?: Pick<TradeAsset, 'assetType'> | null): boolean {
  return asset?.assetType === TradeAssetType.USD_PEGGED_MANA
}

export function denominationOfTrade(trade: Pick<Trade, 'received'>): PriceDenomination {
  return isUSDPeggedTradeAsset(trade.received?.[0]) ? PriceDenomination.USD_PEGGED : PriceDenomination.MANA
}

/**
 * Resolve how a trade-backed listing is priced. Falls back to MANA when the trade cannot be read:
 * every listing the marketplace itself creates is MANA-denominated, so MANA is the safe default for
 * an unknown, and it keeps a failed request from blanking a price that is almost certainly correct.
 */
export async function fetchTradePriceDenomination(tradeId: string): Promise<PriceDenomination> {
  const cached = cache.get(tradeId)
  if (cached) {
    return cached
  }

  const pending = buildService()
    .fetchTrade(tradeId)
    .then(denominationOfTrade)
    .catch(() => {
      // Do not cache a failure: a transient error should not pin the wrong unit for the session.
      cache.delete(tradeId)
      return PriceDenomination.MANA
    })

  cache.set(tradeId, pending)
  return pending
}

/** Test seam — the cache is module state, so specs have to be able to empty it. */
export function clearTradePriceDenominationCache(): void {
  cache.clear()
}
