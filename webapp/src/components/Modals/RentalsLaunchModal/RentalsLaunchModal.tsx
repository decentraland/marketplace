import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Modal,
  // Image,
  Button,
  useMobileMediaQuery,
  Close,
} from 'decentraland-ui'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { SortBy } from '../../../modules/routing/types'
import { VendorName } from '../../../modules/vendor'
import { config } from '../../../config'
import styles from './RentalsLaunchModal.module.css'
import { Props } from './RentalsLaunchModal.types'

const RENTAL_PROMO_POPUP_KEY = 'rental-intro-popup-key'

export const RentalsLaunchModal = ({
  isRentalsLaunchPopupEnabled,
  isLoadingFeatureFlags
}: Props) => {
  const blogPostUrl = `${config.get(
    'DECENTRALAND_BLOG'
  )}/announcements/land-rentals-become-an-easy-process-via-decentraland-s-marketplace/`

  const onClose = useCallback(() => {
    localStorage.setItem(RENTAL_PROMO_POPUP_KEY, 'true')
    setIsOpen(false)
  }, [])

  const [hasLoadedInitialFlags, setHasLoadedInitialFlags] = useState(false)
  useEffect(() => {
    if (!isLoadingFeatureFlags) {
      setHasLoadedInitialFlags(true)
    }
  }, [isLoadingFeatureFlags])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  useEffect(() => {
    setIsOpen(
      !localStorage.getItem(RENTAL_PROMO_POPUP_KEY) &&
        hasLoadedInitialFlags &&
        isRentalsLaunchPopupEnabled
    )
  }, [hasLoadedInitialFlags, isRentalsLaunchPopupEnabled])

  const isMobile = useMobileMediaQuery()
  const modalActions = useMemo(
    () => (
      <Modal.Actions className={styles.modalActions}>
        <Button
          as={Link}
          to={locations.currentAccount({
            assetType: AssetType.NFT,
            section: 'land',
            vendor: VendorName.DECENTRALAND,
            page: 1,
            sortBy: SortBy.NAME,
            onlyOnSale: false,
            viewAsGuest: false
          })}
          onClick={onClose}
        >
          {t('rentals_promotional_modal.list_your_land')}
        </Button>
        <Button
          as={Link}
          to={locations.lands({
            onlyOnRent: true,
            isFullscreen: false,
            isMap: false
          })}
          onClick={onClose}
          primary
        >
          {t('rentals_promotional_modal.browse_listings')}
        </Button>
      </Modal.Actions>
    ),
    [onClose]
  )

  return (
    <Modal
      className={styles.launchModal}
      open={isOpen}
      size={'small'}
      dimmer={{ className: styles.dimmerRemover }}
      onClose={onClose}
      closeIcon={<Close />}
    >
      <Modal.Content className={styles.modalContent}>
        <div
          className={classNames(styles.rentalImage, 'ui medium image')}
        ></div>
        <Modal.Description className={styles.modalDescription}>
          <h2 className={styles.modalTitle}>{t('rentals_promotional_modal.title')}</h2>
          {t('rentals_promotional_modal.description', {
            p: (children: React.ReactElement) => <p>{children}</p>,
            a: (children: React.ReactElement) => (
              <a href={blogPostUrl} target="_blank" rel="noreferrer noopener">
                {children}
              </a>
            )
          })}
          {!isMobile ? modalActions : null}
        </Modal.Description>
      </Modal.Content>
      {isMobile ? modalActions : null}
    </Modal>
  )
}
