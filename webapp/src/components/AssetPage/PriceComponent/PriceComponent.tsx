import React, { useCallback } from 'react'
import classNames from 'classnames'
import CreditsIcon from '../../../images/icon-credits.svg'
import { useIsIAP } from '../../../modules/iap/useIAP'
import { PriceDenomination } from '../../../modules/trade/denomination'
import { useTradePricing } from '../../../modules/trade/hooks'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import Mana from '../../Mana/Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { PeggedManaPrice } from '../../PeggedManaPrice'
import { Props } from './PriceComponent.types'
import styles from './PriceComponent.module.css'

const PriceComponent = ({ price, network, useCredits, credits, tradeId, className }: Props) => {
  const isIAP = useIsIAP()
  const { denomination, marketplaceAddress } = useTradePricing(tradeId)
  const isUSDPegged = denomination === PriceDenomination.USD_PEGGED
  const getAdjustedPrice = useCallback(
    (originalPrice: string) => {
      if (!useCredits || !credits) return originalPrice
      const bigIntPrice = BigInt(originalPrice) - BigInt(credits.totalCredits)
      return bigIntPrice > 0 ? bigIntPrice.toString() : '0'
    },
    [useCredits, credits]
  )

  // A USD-pegged listing carries USD wei, so the raw amount must not reach the MANA maths below: neither
  // `formatWeiMANA`, nor `ManaToFiat`, nor the MANA-denominated credits discount is meaningful against it.
  // Converted through the settlement oracle it IS a MANA price, which is what this app charges — so that is
  // what the buyer sees, marked approximate because the rate moves before they confirm. This branch comes
  // first precisely so nothing downstream can touch the unconverted figure.
  if (isUSDPegged) {
    return (
      <div className={classNames(styles.PriceContainer, className)}>
        <PeggedManaPrice usdWei={price} network={network} marketplaceAddress={marketplaceAddress} size="large" />
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
