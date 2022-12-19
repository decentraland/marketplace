import React, { useCallback, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal, Image, Button, ModalNavigation } from 'decentraland-ui'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { SortBy } from '../../../modules/routing/types'
import { VendorName } from '../../../modules/vendor'
import { config } from '../../../config'
import styles from './PromotionalModal.module.css'
import { Link } from 'react-router-dom'

const RENTAL_PROMO_POPUP_KEY = 'rental-intro-popup-key'

export const PromotionalModal = () => {
  const blogPostUrl = `${config.get(
    'DECENTRALAND_BLOG'
  )}/announcements/land-rentals-become-an-easy-process-via-decentraland-s-marketplace/`
  const onClose = useCallback(() => {
    localStorage.setItem(RENTAL_PROMO_POPUP_KEY, 'true')
    setIsOpen(false)
  }, [])
  const [isOpen, setIsOpen] = useState<boolean>(
    !localStorage.getItem(RENTAL_PROMO_POPUP_KEY) || true
  )
  console.log(
    'Default value of rental promo popup key',
    localStorage.getItem(RENTAL_PROMO_POPUP_KEY),
    isOpen
  )

  return (
    <Modal
      className={styles.promotionalModal}
      open={isOpen}
      size={'small'}
      onClose={onClose}
    >
      <ModalNavigation
        title={t('rentals_promotional_modal.title')}
        onClose={onClose}
      />
      <Modal.Content image>
        <Image size="medium" src="/rental_promotional_image.png" wrapped />
        <Modal.Description>
          {t('rentals_promotional_modal.description', {
            p: (children: React.ReactElement) => <p>{children}</p>,
            a: (children: React.ReactElement) => (
              <a href={blogPostUrl} target="_blank" rel="noreferrer noopener">
                {children}
              </a>
            )
          })}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          as={Link}
          to={locations.lands({ onlyOnRent: true })}
          onClick={onClose}
          primary
        >
          {t('rentals_promotional_modal.browse_listings')}
        </Button>
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
      </Modal.Actions>
    </Modal>
  )
}
