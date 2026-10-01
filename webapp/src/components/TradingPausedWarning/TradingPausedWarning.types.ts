import { Pausable } from '../../lib/pausedTrades'

export enum TradingPausedWarningVariant {
  LISTING = 'listing',
  BID = 'bid'
}

export type Props = {
  listing: Pausable
  // The lister's (seller's or bidder's) own entry, which gets the cancel-and-recreate copy.
  isOwnListing?: boolean
  variant?: TradingPausedWarningVariant
  className?: string
}
