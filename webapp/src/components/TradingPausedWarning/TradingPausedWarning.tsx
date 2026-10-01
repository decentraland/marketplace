import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { isPaused } from '../../lib/pausedTrades'
import { Props, TradingPausedWarningVariant } from './TradingPausedWarning.types'
import styles from './TradingPausedWarning.module.css'

const MESSAGE_KEYS: Record<TradingPausedWarningVariant, { own: string; other: string }> = {
  [TradingPausedWarningVariant.LISTING]: { own: 'trading_paused_warning.owner', other: 'trading_paused_warning.visitor' },
  [TradingPausedWarningVariant.BID]: { own: 'trading_paused_warning.bid_bidder', other: 'trading_paused_warning.bid_seller' }
}

const TradingPausedWarning = ({ listing, isOwnListing = false, variant = TradingPausedWarningVariant.LISTING, className }: Props) => {
  if (!isPaused(listing)) return null

  const keys = MESSAGE_KEYS[variant]

  return (
    <div className={classNames(styles.warning, className)} role="alert">
      <Icon name="pause circle" />
      <span className={styles.message}>{t(isOwnListing ? keys.own : keys.other)}</span>
    </div>
  )
}

export default React.memo(TradingPausedWarning)
