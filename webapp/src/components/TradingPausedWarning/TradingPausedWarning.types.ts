import { Pausable } from '../../lib/pausedTrades'

export enum TradingPausedWarningVariant {
  LISTING = 'listing',
  // A primary sale, sold straight from the collection rather than through a seller's listing.
  ITEM = 'item',
  BID = 'bid'
}

export type Props = {
  listing: Pausable
  // The lister's (seller's or bidder's) own entry, which gets the cancel-and-recreate copy.
  isOwnListing?: boolean
  variant?: TradingPausedWarningVariant
  className?: string
}
