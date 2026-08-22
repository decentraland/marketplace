import React from 'react'
import classNames from 'classnames'
import { ChainId } from '@dcl/schemas'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib/eth'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { useManaUsdRate } from '../../modules/trade/hooks'
import { usdWeiToManaWei } from '../../modules/trade/manaRate'
import { Props } from './PeggedManaPrice.types'
import styles from './PeggedManaPrice.module.css'

/**
 * `getChainIdByNetwork` reads app config and THROWS when that is not initialised. A leaf price component must
 * not be able to take a grid of ninety cards down with it, so a failure resolves to no chain — which renders
 * the unavailable state rather than an exception.
 */
function chainIdOf(network: Props['network']): ChainId | undefined {
  try {
    return getChainIdByNetwork(network)
  } catch {
    return undefined
  }
}

/**
 * A USD-pegged listing, priced in the currency this app actually charges: MANA.
 *
 * A `USD_PEGGED_MANA` trade denominates the item in USD, and the marketplace contract converts to MANA at
 * accept time. So the number a buyer needs is how much MANA the listing costs right now — not the USD figure,
 * and not a shop-side unit. (Rendering it as "credits" was doubly wrong here: this app has its own, unrelated
 * Credits programme, so the word already means something else on this screen.)
 *
 * APPROXIMATE, AND SAID SO. The rate moves between this render and the buyer's confirmation, so the exact MANA
 * charged is whatever the oracle says at accept time. The `~` is the honest marker for that; if the rate moves
 * far enough that the transaction fails, the buyer retries against a fresh quote. Overstating it as exact is
 * what would earn a "you charged me a different price" — and the conversion deliberately truncates rather than
 * rounds up so the shown figure never sits above the charge.
 */
const PeggedManaPrice = ({ usdWei, network, size = 'medium', className, manaClassName, inline }: Props) => {
  const { status, rate } = useManaUsdRate(chainIdOf(network))
  const manaWei = rate ? usdWeiToManaWei(usdWei, rate) : null

  // The read has not come back yet. There is no figure to show, but there is nothing wrong either — so hold
  // the space and say nothing. Announcing "price unavailable" here is a claim about the oracle that the first
  // frame of every render was making on its behalf, and on a grid that is one false alarm per card.
  if (status === 'pending') {
    return (
      <span
        className={classNames(styles.PeggedManaPrice, styles.loading, className)}
        data-testid="pegged-mana-price-loading"
        aria-busy="true"
      />
    )
  }

  // Now it is a real answer: the oracle could not be reached, or answered something a price cannot be built
  // from. Saying so beats rendering a placeholder number next to a Buy button.
  if (manaWei === null) {
    return (
      <span className={classNames(styles.PeggedManaPrice, styles.unavailable, className)} data-testid="pegged-mana-price-unavailable">
        {t('pegged_mana_price.unavailable')}
      </span>
    )
  }

  return (
    <span className={classNames(styles.PeggedManaPrice, className)} data-testid="pegged-mana-price">
      <Mana className={manaClassName} network={network} size={size} inline={inline}>
        {t('pegged_mana_price.approximate', { amount: formatWeiMANA(manaWei) })}
      </Mana>
    </span>
  )
}

export default React.memo(PeggedManaPrice)
