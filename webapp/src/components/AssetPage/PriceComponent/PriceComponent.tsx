import React, { useCallback } from 'react'
import classNames from 'classnames'
import CreditsIcon from '../../../images/icon-credits.svg'
import { useIsIAP } from '../../../modules/iap/useIAP'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import Mana from '../../Mana/Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { Props } from './PriceComponent.types'
import styles from './PriceComponent.module.css'

const PriceComponent = ({ price, network, useCredits, credits, className }: Props) => {
  const isIAP = useIsIAP()
  const getAdjustedPrice = useCallback(
    (originalPrice: string) => {
      if (!useCredits || !credits) return originalPrice
      const bigIntPrice = BigInt(originalPrice) - BigInt(credits.totalCredits)
      return bigIntPrice > 0 ? bigIntPrice.toString() : '0'
    },
    [useCredits, credits]
  )

  if (useCredits && credits) {
    const adjustedPrice = getAdjustedPrice(price)
    return (
      <div className={classNames(styles.PriceContainer, className)}>
        <div className={styles.manaContainer}>
          <Mana withTooltip size="large" network={network} />
          <div className={classNames(styles.prices, styles.price)}>
            <span className={styles.originalPrice}>{formatWeiToAssetCard(price)}</span>
            <span className={styles.adjustedPrice}>{formatWeiToAssetCard(adjustedPrice)}</span>
          </div>
        </div>
        {+adjustedPrice > 0 && (
          <div className={styles.informationText}>
            {'('}
            <ManaToFiat mana={adjustedPrice} />
            {')'}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={classNames(styles.PriceContainer, className, { [styles.iapPrice]: isIAP })}>
      <div className={styles.manaContainer}>
        {isIAP ? (
          <img src={CreditsIcon} alt="Credits" className={styles.creditsIcon} />
        ) : (
          <Mana withTooltip size="large" network={network} />
        )}
        <span className={styles.price}>{formatWeiToAssetCard(price)}</span>
      </div>
      {!isIAP && +price > 0 && (
        <div className={styles.informationText}>
          {'('}
          <ManaToFiat mana={price} />
          {')'}
        </div>
      )}
    </div>
  )
}

export default React.memo(PriceComponent)
