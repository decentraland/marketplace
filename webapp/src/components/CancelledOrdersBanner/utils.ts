import { getBuilderCollectionDetailUrl } from '../../modules/collection/utils'
import { locations } from '../../modules/routing/locations'
import { CancelledTrade, CancelledTradeType } from '../../modules/vendor/decentraland/cancelledTrades/types'

const DISMISS_KEY_PREFIX = 'cancelled-orders-banner'

export type RecreateLink = { url: string; isExternal: boolean }

const getDismissKey = (address: string) => `${DISMISS_KEY_PREFIX}:${address.toLowerCase()}`

export const getNewestCancelledAt = (trades: CancelledTrade[]): number =>
  trades.reduce((newest, trade) => Math.max(newest, trade.cancelledAt), 0)

// Dismissal is per wallet up to the newest cancellation, so only later cancellations show it again.
export const isCancelledOrdersBannerDismissed = (address: string, newestCancelledAt: number): boolean => {
  try {
    const dismissedAt = localStorage.getItem(getDismissKey(address))
    return dismissedAt !== null && Number(dismissedAt) >= newestCancelledAt
  } catch {
    return false
  }
}

export const dismissCancelledOrdersBanner = (address: string, newestCancelledAt: number): void => {
  try {
    localStorage.setItem(getDismissKey(address), newestCancelledAt.toString())
  } catch {
    // Storage unavailable: the dismissal only lasts for this page view.
  }
}

export const getRecreateLink = (trade: CancelledTrade): RecreateLink | null => {
  const { contractAddress, tokenId, itemId } = trade.asset

  switch (trade.type) {
    case CancelledTradeType.PUBLIC_NFT_ORDER:
      return tokenId ? { url: locations.sell(contractAddress, tokenId), isExternal: false } : null
    case CancelledTradeType.BID:
      if (tokenId) return { url: locations.bid(contractAddress, tokenId), isExternal: false }
      if (itemId) return { url: locations.bidItem(contractAddress, itemId), isExternal: false }
      return null
    case CancelledTradeType.PUBLIC_ITEM_ORDER:
      // Item listings are managed by the creator in the Builder.
      return { url: getBuilderCollectionDetailUrl(contractAddress), isExternal: true }
    default:
      return null
  }
}
