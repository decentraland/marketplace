import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Popup } from 'decentraland-ui'
import { formatCredits, formatCreditsAsUsd, formatCreditsFull, usdWeiToCredits } from '../../lib/credits'
import { Props } from './CreditsPrice.types'
import styles from './CreditsPrice.module.css'

/**
 * A USD-pegged listing price, rendered in credits.
 *
 * This is the counterpart to `Mana` for trades whose received asset is `USD_PEGGED_MANA`: those
 * amounts are USD wei, so putting them behind the MANA glyph (and through `ManaToFiat`) misreports
 * the price by the MANA/USD rate. The peg and the round-up live in `lib/credits`.
 */
const CreditsPrice = ({ usdWei, size = 'medium', showUsd = false, className }: Props) => {
  const credits = usdWeiToCredits(usdWei)

  if (credits === null) {
    return (
      <span className={classNames(styles.CreditsPrice, styles.unavailable, className)} data-testid="credits-price-unavailable">
        {t('credits_price.unavailable')}
      </span>
    )
  }

  return (
    <span className={classNames(styles.CreditsPrice, styles[size], className)} data-testid="credits-price">
      <Popup
        content={t('credits_price.tooltip')}
        position="top center"
        on="hover"
        trigger={<i className={styles.icon} aria-hidden="true" />}
      />
      <span title={t('credits_price.amount', { amount: formatCreditsFull(credits) })}>{formatCredits(credits)}</span>
      {showUsd && <span className={styles.usd}>({formatCreditsAsUsd(credits)})</span>}
    </span>
  )
}

export default React.memo(CreditsPrice)
