import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Loader, Modal, ModalNavigation } from 'decentraland-ui'
import { Props } from './CheckoutPriceUnavailableModal.types'
import styles from './CheckoutPriceUnavailableModal.module.css'

/**
 * What the checkout shows when it cannot state the price.
 *
 * A listing's `price` field carries no unit: a USD-pegged trade prices in USD and the marketplace converts to
 * MANA with its own oracle at accept time, so the MANA to charge is only known once the trade and the rate
 * have been read. When either read is unavailable, this stands in for the confirmation screen rather than
 * showing a figure in the wrong unit.
 */
const CheckoutPriceUnavailableModal = ({ name, isLoading, onClose }: Props) => (
  <Modal open name={name} size="tiny" className={styles.modal} onClose={onClose}>
    <ModalNavigation title={t('checkout_price_unavailable_modal.title')} onClose={onClose} />
    <Modal.Content className={styles.content}>
      {isLoading ? (
        <Loader active inline size="medium" data-testid="checkout-price-loader" />
      ) : (
        <>
          <p className={styles.description}>{t('checkout_price_unavailable_modal.description')}</p>
          <Button primary fluid onClick={onClose}>
            {t('global.close')}
          </Button>
        </>
      )}
    </Modal.Content>
  </Modal>
)

export default React.memo(CheckoutPriceUnavailableModal)
