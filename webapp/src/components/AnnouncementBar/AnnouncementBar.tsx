import React, { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../config'
import ArrowIcon from '../../images/announcement-bar-arrow.svg'
import CloseIcon from '../../images/announcement-bar-close.svg'
import * as events from '../../utils/events'
import { Props } from './AnnouncementBar.types'
import styles from './AnnouncementBar.module.css'

const ANNOUNCEMENT_BAR_KEY = 'shop-announcement-bar'
const ANNOUNCEMENT_BAR_SOURCE = 'marketplace'

// Reading or writing localStorage throws a SecurityError where the browser denies storage (some
// in-app WebViews, blocked site data). The bar renders from PageLayout, so a throw here would take
// the whole page down: storage is best-effort, and without it the dismissal only lasts this page view.
export const isAnnouncementBarDismissed = (): boolean => {
  try {
    return localStorage.getItem(ANNOUNCEMENT_BAR_KEY) !== null
  } catch {
    return false
  }
}

const rememberAnnouncementBarDismissal = (): void => {
  try {
    localStorage.setItem(ANNOUNCEMENT_BAR_KEY, '1')
  } catch {
    // Storage unavailable: the parent still hides the bar for this page view.
  }
}

const AnnouncementBar = ({ onDismiss }: Props) => {
  const { pathname } = useLocation()

  // The campaign params let the shop attribute what these visitors do after they
  // land, which the click event alone cannot tell us.
  const shopUrl = useMemo(() => {
    const url = new URL(config.get('SHOP_URL'))
    url.searchParams.set('utm_source', ANNOUNCEMENT_BAR_SOURCE)
    url.searchParams.set('utm_medium', 'announcement_bar')
    url.searchParams.set('utm_campaign', 'shop_launch')
    return url.toString()
  }, [])

  const handleDismiss = useCallback(() => {
    rememberAnnouncementBarDismissal()
    getAnalytics()?.track(events.DISMISS_SHOP_ANNOUNCEMENT_BAR, { source: ANNOUNCEMENT_BAR_SOURCE, path: pathname })
    onDismiss()
  }, [onDismiss, pathname])

  const handleClick = useCallback(() => {
    getAnalytics()?.track(events.CLICK_SHOP_ANNOUNCEMENT_BAR, { source: ANNOUNCEMENT_BAR_SOURCE, path: pathname })
  }, [pathname])

  return (
    <aside className={styles.bar}>
      <p className={styles.message}>
        <T
          id="announcement_bar.message"
          values={{ highlight: <span className={styles.highlight}>{t('announcement_bar.highlight')}</span> }}
        />
      </p>
      <a className={styles.cta} href={shopUrl} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
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
