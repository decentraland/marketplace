import React, { useCallback, useMemo } from 'react'
import { ethers } from 'ethers'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Button, Popup } from 'decentraland-ui'
import { Switch } from 'decentraland-ui2'
import { config } from '../../../../config'
import CreditsIcon from '../../../../images/icon-credits.svg'
import { Props } from './UseCreditsToggle.types'
import styles from './UseCreditsToggle.module.css'

const UseCreditsToggle = ({ assetPrice, credits, isOwner, useCredits, onUseCredits }: Props) => {
  const handleToggleCredits = useCallback(() => {
    onUseCredits(!useCredits)
  }, [useCredits, onUseCredits])

  // convert credits to eth, they are stored in wei
  const creditsToUseInEth = useMemo(() => {
    if (!credits || !credits.totalCredits) {
      return '0'
    }

    const inEth = ethers.utils.formatEther(credits.totalCredits.toString())
    const assetPriceInEth = assetPrice ? ethers.utils.formatEther(assetPrice.toString()) : '0'
    return assetPrice ? Math.min(Number(assetPriceInEth), Number(inEth)) : inEth // min between asset price and credits to be spent
  }, [credits, assetPrice])

  if (!credits || !credits.totalCredits) {
    // If the user is the owner or the credits are not available, we don't show the toggle
    if (isOwner) {
      return null
    }

    // Show the GET CREDITS button
    return (
      <div className={`${styles.creditsContainer} ${useCredits ? styles.creditsContainerActive : ''}`}>
        <div className={styles.creditsLeft}>
          <img className={styles.creditsIcon} src={CreditsIcon} alt="Credits" />
          <span className={styles.creditsText}>{t('asset_page.actions.get_with_credits')}</span>
        </div>
        <span className={styles.creditsAmount}>
          <Button
            basic
            className={styles.learnMore}
            onClick={() => {
              // TODO: review this link
              window.open(config.get('CREDITS_DOCS_URL'), '_blank', 'noopener')
            }}
          >
            {t('global.learn_more')}
          </Button>
        </span>
      </div>
    )
  }

  return (
    <div className={`${styles.creditsContainer} ${useCredits ? styles.creditsContainerActive : ''}`}>
      <div className={styles.creditsLeft}>
        <Switch checked={useCredits} onChange={handleToggleCredits} />
        <span className={styles.creditsText}>{t('asset_page.actions.use_credits')}</span>
      </div>
      <span className={styles.creditsAmount}>
        <Popup
          content={<span>{t('credits.value')}</span>}
          position="top center"
          trigger={<span className={styles.creditsNumber}>{creditsToUseInEth}</span>}
          on="hover"
        />
      </span>
    </div>
  )
}

export default React.memo(UseCreditsToggle)
