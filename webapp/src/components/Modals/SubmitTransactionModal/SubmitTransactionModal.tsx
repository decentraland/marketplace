import React from 'react'
import { Modal } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Loader, Message, ModalNavigation } from 'decentraland-ui'
import { Props } from './SubmitTransactionModal.types'
import styles from './SubmitTransactionModal.module.css'

const SubmitTransactionModal = ({
  title,
  confirm_transaction_message,
  showConfirmMessage,
  action_message,
  children,
  name,
  error,
  onSubmitTransaction,
  isTransactionBeingConfirmed,
  isSubmittingTransaction,
  className,
  onClose
}: Props) => {
  const isLoading = isTransactionBeingConfirmed || isSubmittingTransaction

  return (
    <Modal size="tiny" name={name} onClose={!isLoading ? onClose : undefined}>
      <ModalNavigation title={title} onClose={!isLoading ? onClose : undefined} />
      <Modal.Content className={className}>
        {children}

        {error ? <Message error size="tiny" visible content={error} header={t('global.error')} /> : null}
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        {isLoading ? (
          <div className={styles.loader}>
            <Loader inline size="small" />{' '}
            {isSubmittingTransaction && showConfirmMessage ? (
              <span className={styles.signMessage}>{confirm_transaction_message}</span>
            ) : null}
          </div>
        ) : (
          <Button primary disabled={isLoading} onClick={onSubmitTransaction}>
            {action_message}
          </Button>
        )}
        <Button secondary disabled={isLoading} className={styles.cancel} onClick={onClose}>
          {t('global.cancel')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(SubmitTransactionModal)
