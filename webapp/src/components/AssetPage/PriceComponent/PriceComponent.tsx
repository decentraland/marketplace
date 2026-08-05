import React, { useCallback } from 'react'
import classNames from 'classnames'
import CreditsIcon from '../../../images/icon-credits.svg'
import { useIsIAP } from '../../../modules/iap/useIAP'
import { PriceDenomination } from '../../../modules/trade/denomination'
import { useTradePriceDenomination } from '../../../modules/trade/hooks'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import { CreditsPrice } from '../../CreditsPrice'
import Mana from '../../Mana/Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { Props } from './PriceComponent.types'
import styles from './PriceComponent.module.css'

const PriceComponent = ({ price, network, useCredits, credits, tradeId, className }: Props) => {
  const isIAP = useIsIAP()
  const isUSDPegged = useTradePriceDenomination(tradeId) === PriceDenomination.USD_PEGGED
  const getAdjustedPrice = useCallback(
    (originalPrice: string) => {
      if (!useCredits || !credits) return originalPrice
      const bigIntPrice = BigInt(originalPrice) - BigInt(credits.totalCredits)
      return bigIntPrice > 0 ? bigIntPrice.toString() : '0'
    },
    [useCredits, credits]
  )

  // A USD-pegged listing is priced in USD wei, so neither the MANA glyph, the MANA/USD conversion nor
  // the MANA-denominated credits discount applies to it. Render the credit price the buyer is actually
  // charged and stop — this branch comes first so none of the MANA maths below can reach the amount.
  if (isUSDPegged) {
    return (
      <div className={classNames(styles.PriceContainer, className)}>
        <CreditsPrice usdWei={price} size="large" showUsd />
      </div>
    )
  }

  if (isIAP) {
    return (
      <div className={classNames(styles.PriceContainer, className, styles.iapPrice)}>
        <div className={styles.manaContainer}>
          <img src={CreditsIcon} alt="Credits" className={styles.creditsIcon} />
          <span className={styles.price}>{formatWeiToAssetCard(price)}</span>
        </div>
      </div>
    )
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
