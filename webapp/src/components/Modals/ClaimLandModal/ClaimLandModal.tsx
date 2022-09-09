import React from 'react'
import { Button, Loader, Message, ModalNavigation } from 'decentraland-ui'
import { Modal } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ClaimLandModal.types'
import styles from './ClaimLandModal.module.css'

const ClaimModal = ({
  name,
  error,
  onClaimLand,
  isClaimingLand,
  isSigningTransaction,
  onClose
}: Props) => {
  const isLoading = isClaimingLand || isSigningTransaction

  return (
    <Modal
      size="tiny"
      name={name}
      onClose={isLoading ? () => undefined : onClose}
    >
      <ModalNavigation title={t('claim_land_modal.title')} />
      <Modal.Content className={styles.content}>
        <p>{t('claim_land_modal.question')}</p>
        <p>{t('claim_land_modal.disclaimer')}</p>

        <Message
          error
          size="tiny"
          visible
          content={error}
          header={t('global.error')}
        />
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        {isLoading ? (
          <div className={styles.loader}>
            <Loader inline size="small" />{' '}
            {isSigningTransaction ? (
              <span className={styles.signMessage}>
                {t('claim_land_modal.confirm_transaction')}
              </span>
            ) : null}
          </div>
        ) : (
          <Button primary disabled={isLoading} onClick={onClaimLand}>
            {t('claim_land_modal.action')}
          </Button>
        )}
        <Button
          className={styles.cancel}
          secondary
          disabled={isLoading}
          onClick={onClose}
        >
          {t('global.cancel')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(ClaimModal)
