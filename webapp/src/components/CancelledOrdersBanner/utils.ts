import { getBuilderCollectionDetailUrl } from '../../modules/collection/utils'
import { locations } from '../../modules/routing/locations'
import { CancelledTrade, CancelledTradeType } from '../../modules/vendor/decentraland/cancelledTrades/types'

const DISMISS_KEY_PREFIX = 'cancelled-orders-banner'

export const POST_MORTEM_URL =
  'https://forum.decentraland.org/t/october-2026-off-chain-marketplace-cancelled-order-replay-eip-7702-signature-malleability-post-mortem/25452'

export type RecreateLink = { url: string; isExternal: boolean }

const getDismissKey = (address: string) => `${DISMISS_KEY_PREFIX}:${address.toLowerCase()}`

export const getNewestCancelledAt = (trades: CancelledTrade[]): number =>
  trades.reduce((newest, trade) => Math.max(newest, trade.cancelledAt), 0)

export type DismissalMark = { newestCancelledAt: number; total: number }

// Per wallet. The list is sorted by creation, so a later bump can cancel trades past the loaded page:
// a grown total re-shows it too.
export const isCancelledOrdersBannerDismissed = (address: string, { newestCancelledAt, total }: DismissalMark): boolean => {
  try {
    const stored = localStorage.getItem(getDismissKey(address))
    if (stored === null) return false
    const dismissed = JSON.parse(stored) as Partial<DismissalMark> | null
    return (
      typeof dismissed?.newestCancelledAt === 'number' &&
      typeof dismissed.total === 'number' &&
      dismissed.newestCancelledAt >= newestCancelledAt &&
      dismissed.total >= total
    )
  } catch {
    return false
  }
}

export const dismissCancelledOrdersBanner = (address: string, mark: DismissalMark): void => {
  try {
    localStorage.setItem(getDismissKey(address), JSON.stringify(mark))
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
