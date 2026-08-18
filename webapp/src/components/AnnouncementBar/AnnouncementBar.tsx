import React, { useCallback, useState } from 'react'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../config'
import ArrowIcon from '../../images/announcement-bar-arrow.svg'
import CloseIcon from '../../images/announcement-bar-close.svg'
import * as events from '../../utils/events'
import styles from './AnnouncementBar.module.css'

const ANNOUNCEMENT_BAR_KEY = 'shop-announcement-bar'

const AnnouncementBar = () => {
  const [isDismissed, setIsDismissed] = useState(() => localStorage.getItem(ANNOUNCEMENT_BAR_KEY) !== null)

  const handleDismiss = useCallback(() => {
    localStorage.setItem(ANNOUNCEMENT_BAR_KEY, '1')
    setIsDismissed(true)
    getAnalytics()?.track(events.DISMISS_SHOP_ANNOUNCEMENT_BAR)
  }, [])

  const handleClick = useCallback(() => {
    getAnalytics()?.track(events.CLICK_SHOP_ANNOUNCEMENT_BAR)
  }, [])

  if (isDismissed) {
    return null
  }

  return (
    <aside className={styles.bar}>
      <p className={styles.message}>
        <T
          id="announcement_bar.message"
          values={{ highlight: <span className={styles.highlight}>{t('announcement_bar.highlight')}</span> }}
        />
      </p>
      <a className={styles.cta} href={config.get('SHOP_URL')} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
        <span className={styles.ctaLabel}>{t('announcement_bar.cta')}</span>
        <span className={styles.ctaIcon}>
          <img src={ArrowIcon} alt="" />
        </span>
      </a>
      <button type="button" className={styles.close} onClick={handleDismiss} aria-label={t('announcement_bar.dismiss')}>
        <img src={CloseIcon} alt="" />
      </button>
    </aside>
  )
}

export default React.memo(AnnouncementBar)
