import React, { useCallback, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import CloseIcon from '../../images/announcement-bar-close.svg'
import CancelledOrdersModal from './CancelledOrdersModal'
import { dismissCancelledOrdersBanner, getNewestCancelledAt, isCancelledOrdersBannerDismissed } from './utils'
import { Props } from './CancelledOrdersBanner.types'
import styles from './CancelledOrdersBanner.module.css'

const CancelledOrdersBanner = ({ address, total, ...listProps }: Props) => {
  const newestCancelledAt = useMemo(() => getNewestCancelledAt(listProps.trades), [listProps.trades])
  const [isDismissed, setIsDismissed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDismiss = useCallback(() => {
    dismissCancelledOrdersBanner(address, newestCancelledAt)
    setIsDismissed(true)
  }, [address, newestCancelledAt])

  const handleOpen = useCallback(() => setIsModalOpen(true), [])
  const handleClose = useCallback(() => setIsModalOpen(false), [])

  if (total === 0 || isDismissed || isCancelledOrdersBannerDismissed(address, newestCancelledAt)) return null

  return (
    <>
      <aside className={styles.bar} role="status">
        <Icon name="exclamation triangle" className={styles.icon} />
        <p className={styles.message}>{t('cancelled_orders_banner.message', { count: total })}</p>
        <button type="button" className={styles.cta} onClick={handleOpen}>
          {t('cancelled_orders_banner.cta')}
        </button>
        <button type="button" className={styles.close} onClick={handleDismiss} aria-label={t('cancelled_orders_banner.dismiss')}>
          <img src={CloseIcon} alt="" />
        </button>
      </aside>
      <CancelledOrdersModal open={isModalOpen} total={total} onClose={handleClose} {...listProps} />
    </>
  )
}

export default React.memo(CancelledOrdersBanner)
