import { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal, Button, ModalNavigation } from 'decentraland-ui'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import * as decentraland from '../../../modules/vendor/decentraland'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { SortBy } from '../../../modules/routing/types'
import { VendorName } from '../../../modules/vendor'
import { Props } from './ListsLaunchModal.types'
import styles from './ListsLaunchModal.module.css'

const LISTS_PROMO_POPUP_KEY = 'lists-intro-popup-key'

export const ListsLaunchModal = ({
  isListsLaunchPopupEnabled,
  isLoadingFeatureFlags
}: Props) => {
  const onClose = useCallback(() => {
    localStorage.setItem(LISTS_PROMO_POPUP_KEY, 'true')
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
      !localStorage.getItem(LISTS_PROMO_POPUP_KEY) &&
        hasLoadedInitialFlags &&
        isListsLaunchPopupEnabled
    )
  }, [hasLoadedInitialFlags, isListsLaunchPopupEnabled])

  return (
    <Modal
      className={styles.launchModal}
      open={isOpen}
      size={'small'}
      onClose={onClose}
      dimmer={{ className: styles.dimmerRemover }}
    >
      <ModalNavigation title={t('lists_ftu.title')} onClose={onClose} />
      <Modal.Content className={styles.content}>
        <div className={classNames(styles.listsLogo, 'ui medium image')}></div>
        <Modal.Description>
          <div className={styles.modalDescription}>
            {t('lists_ftu.description', {
              br: () => <br />,
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
            onlyOnSale: true
          })}
          primary
          onClick={onClose}
          fluid
        >
          {t('lists_ftu.explore_collectibles')}
        </Button>
        <Button
          as={Link}
          inverted
          to={locations.lists()}
          onClick={onClose}
          fluid
          primary
        >
          {t('lists_ftu.view_my_lists')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
