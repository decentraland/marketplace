import React from 'react'
import classNames from 'classnames'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import Mana from '../../Mana/Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { Props } from './PriceComponent.types'
import styles from './PriceComponent.module.css'

const PriceComponent = ({ price, network, useCredits, credits, className }: Props) => {
  const getAdjustedPrice = (originalPrice: string) => {
    if (!useCredits || !credits) return originalPrice
    const bigIntPrice = BigInt(originalPrice) - BigInt(credits.totalCredits)
    return bigIntPrice > 0 ? bigIntPrice.toString() : '0'
  }

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
    <div className={classNames(styles.PriceContainer, className)}>
      <div className={styles.manaContainer}>
        <Mana withTooltip size="large" network={network} />
        <span className={styles.price}>{formatWeiToAssetCard(price)}</span>
      </div>
      {+price > 0 && (
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
