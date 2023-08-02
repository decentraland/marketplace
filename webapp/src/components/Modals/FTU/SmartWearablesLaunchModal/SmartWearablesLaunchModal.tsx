import { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Modal,
  Button,
  ModalNavigation,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { Link } from 'react-router-dom'
import * as decentraland from '../../../../modules/vendor/decentraland'
import { AssetType } from '../../../../modules/asset/types'
import { locations } from '../../../../modules/routing/locations'
import { SortBy } from '../../../../modules/routing/types'
import { VendorName } from '../../../../modules/vendor'
import styles from './SmartWearablesLaunchModal.module.css'
import { Props } from './SmartWearablesLaunchModal.types'

const SMARTS_WEARABLES_PROMO_POPUP_KEY = 'smart-wearables-intro-popup-key'

export const SmartWearablesLaunchModal = ({
  isSmartWearablesFTUEnabled,
  isLoadingFeatureFlags
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const isTabletOrBelow = useTabletAndBelowMediaQuery()

  const onClose = useCallback(() => {
    localStorage.setItem(SMARTS_WEARABLES_PROMO_POPUP_KEY, 'true')
    setIsOpen(false)
  }, [])

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
            section: decentraland.Section.WEARABLES,
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
      </Modal.Actions>
    </Modal>
  )
}
