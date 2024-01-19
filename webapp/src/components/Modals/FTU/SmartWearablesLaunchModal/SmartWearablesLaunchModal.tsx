import { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Modal,
  Button,
  ModalNavigation,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { Section } from '../../../../modules/vendor/decentraland'
import { AssetType } from '../../../../modules/asset/types'
import { locations } from '../../../../modules/routing/locations'
import { SortBy } from '../../../../modules/routing/types'
import { VendorName } from '../../../../modules/vendor'
import { Props } from './SmartWearablesLaunchModal.types'
import styles from './SmartWearablesLaunchModal.module.css'

const SMARTS_WEARABLES_PROMO_POPUP_KEY = 'smart-wearables-intro-popup-key'

export const SmartWearablesLaunchModal = ({
  isSmartWearablesFTUEnabled,
  isLoadingFeatureFlags
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const isTabletOrBelow = useTabletAndBelowMediaQuery()

  const markAsSeen = useCallback(() => {
    localStorage.setItem(SMARTS_WEARABLES_PROMO_POPUP_KEY, 'true')
  }, [])

  const onClose = useCallback(() => {
    markAsSeen()
    setIsOpen(false)
  }, [markAsSeen])

  const onLearnMore = useCallback(() => {
    markAsSeen()
    window.open(
      'https://decentraland.org/blog/announcements/smart-wearables-and-portable-experiences',
      '_blank',
      'noopener noreferrer'
    )
  }, [markAsSeen])

  useEffect(() => {
    if (
      !isLoadingFeatureFlags &&
      isSmartWearablesFTUEnabled &&
      !localStorage.getItem(SMARTS_WEARABLES_PROMO_POPUP_KEY) &&
      !isTabletOrBelow
    ) {
      setIsOpen(true)
    }
  }, [isLoadingFeatureFlags, isSmartWearablesFTUEnabled, isTabletOrBelow])

  return (
    <Modal
      className={styles.SmartWearablesLaunchModal}
      open={isOpen}
      size={'small'}
      onClose={onClose}
      dimmer={{ className: styles.dimmerRemover }}
    >
      <ModalNavigation
        title={t('smart_wearables_ftu_modal.title')}
        onClose={onClose}
      />
      <Modal.Content className={styles.content}>
        <video
          autoPlay
          loop
          className={styles.video}
          src={`${process.env.PUBLIC_URL}/smart-wearables-ftu.mp4`}
          preload="auto"
          muted
        />
        <Modal.Description>
          <div className={styles.description}>
            {t('smart_wearables_ftu_modal.description', {
              b: (children: React.ReactChildren) => <b>{children}</b>
            })}
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button
          as={Link}
          to={locations.browse({
            section: Section.WEARABLES,
            vendor: VendorName.DECENTRALAND,
            page: 1,
            sortBy: SortBy.RECENTLY_LISTED,
            assetType: AssetType.ITEM,
            onlyOnSale: true,
            onlySmart: true
          })}
          primary
          onClick={onClose}
          fluid
        >
          {t('smart_wearables_ftu_modal.explore_collectibles')}
        </Button>
        <Button onClick={onLearnMore} fluid>
          {t('global.learn_more')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
