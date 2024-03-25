import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal, Button, ModalNavigation, useTabletAndBelowMediaQuery, Icon } from 'decentraland-ui'
import { locations } from '../../../modules/routing/locations'
import { EXPIRED_LISTINGS_MODAL_KEY } from '../../../modules/ui/utils'
import * as decentraland from '../../../modules/vendor/decentraland'
import styles from './ExpiredListingsModal.module.css'

export const ExpiredListingsModal = () => {
  const onDontShowAgain = useCallback(() => {
    localStorage.setItem(EXPIRED_LISTINGS_MODAL_KEY, 'true')
    setIsOpen(false)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const isTabletOrBelow = useTabletAndBelowMediaQuery()
  const [isOpen, setIsOpen] = useState<boolean>(true)
  useEffect(() => {
    setIsOpen(!localStorage.getItem(EXPIRED_LISTINGS_MODAL_KEY) && !isTabletOrBelow)
  }, [isTabletOrBelow])

  return (
    <Modal
      className={styles.ExpiredListingsModal}
      open={isOpen}
      size={'small'}
      onClose={onClose}
      dimmer={{ className: styles.dimmerRemover }}
    >
      <ModalNavigation title={t('expired_listings_modal.title')} onClose={onClose} />
      <Modal.Content className={styles.content}>
        <div className={styles.warningIconContainer}>
          <Icon name="exclamation triangle" className={styles.warningExpiration} />
        </div>
        <Modal.Description>
          <div className={styles.modalDescription}>
            {t('expired_listings_modal.description', {
              br: () => <br />
            })}
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button
          as={Link}
          to={locations.currentAccount({
            section: decentraland.Section.ON_SALE
          })}
          primary
          onClick={onClose}
          fluid
        >
          {t('expired_listings_modal.go_to_my_assets')}
        </Button>
        <Button inverted onClick={onDontShowAgain} fluid primary>
          {t('expired_listings_modal.do_not_show_again')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
