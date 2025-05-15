import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import Lottie from 'lottie-react'
import { CreditsClient } from 'decentraland-dapps/dist/modules/credits/CreditsClient'
import { SeasonResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Button, Popup } from 'decentraland-ui'
import { Switch } from 'decentraland-ui2'
import { config } from '../../../../config'
import CreditsIcon from '../../../../images/icon-credits.svg'
import toggleAnimation from './toggleAnimation.json'
import { Props } from './UseCreditsToggle.types'
import styles from './UseCreditsToggle.module.css'

const UseCreditsToggle = ({ assetPrice, credits, isOwner, useCredits, onUseCredits }: Props) => {
  const [seasonInfo, setSeasonInfo] = useState<SeasonResponse | null>(null)

  useEffect(() => {
    const fetchSeasonInfo = async () => {
      try {
        const creditsClient = new CreditsClient(config.get('CREDITS_SERVER_URL'))
        const season = await creditsClient.fetchSeason()
        setSeasonInfo(season as SeasonResponse)
      } catch (error) {
        console.error('Error fetching season info:', error)
      }
    }

    fetchSeasonInfo().catch(error => console.error('Error in fetchSeasonInfo:', error))
  }, [])

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

  if (seasonInfo?.isPaused) {
    return (
      <div className={`${styles.creditsContainer}`}>
        <div className={styles.creditsLeft}>
          <img className={styles.creditsIcon} src={CreditsIcon} alt="Credits" />
          <span className={styles.creditsText}>{t('asset_page.actions.get_with_credits')}</span>
        </div>
        <div className={styles.temporarilyUnavailableContainer}>
          <Popup
            hoverable
            wide="very"
            style={{ width: 350 }}
            content={
              <div className={styles.tooltipContent}>
                {t('credits.offline_message', {
                  discord_link: (
                    <a href="https://discord.gg/decentraland" target="_blank" rel="noopener noreferrer" className={styles.discordLink}>
                      discord.gg/decentraland
                    </a>
                  ),
                  br: <br />
                })}
              </div>
            }
            position="top center"
            trigger={
              <div className={styles.infoIconContainer}>
                <div className={styles.infoIcon}></div>
              </div>
            }
            on="hover"
          />
          <span className={styles.temporarilyUnavailable}>{t('global.temporarily_unavailable')}</span>
        </div>
      </div>
    )
  }

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
              window.open(
                `${config.get('DECENTRALAND_BLOG')}/announcements/marketplace-credits-earn-weekly-rewards-to-power-up-your-look?utm_org=dcl&utm_source=marketplace&utm_medium=organic&utm_campaign=marketplacecredits`,
                '_blank',
                'noopener noreferrer'
              )
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
        {useCredits && <Lottie animationData={toggleAnimation} loop={false} className={styles.animation} />}
        <Switch checked={useCredits} onChange={handleToggleCredits} />
        <span className={styles.creditsText}>{t('asset_page.actions.use_credits')}</span>
      </div>
      <span className={styles.creditsAmount}>
        <Popup
          content={<span>{t('credits.value')}</span>}
          position="top center"
          trigger={
            <div className={styles.creditsPopupContainer}>
              <img className={styles.creditsIcon} src={CreditsIcon} alt="Credits" />
              <span className={styles.creditsNumber}>{creditsToUseInEth}</span>
            </div>
          }
          on="hover"
        />
      </span>
    </div>
  )
}

export default React.memo(UseCreditsToggle)
