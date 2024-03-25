import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { SubmitTransactionModal } from '../SubmitTransactionModal'
import { Props } from './RemoveRentalModal.types'
import styles from './RemoveRentalModal.module.css'

const RemoveRentalModal = ({ ...props }: Props) => {
  return (
    <SubmitTransactionModal
      title={t('remove_rental_modal.title')}
      confirm_transaction_message={t('remove_rental_modal.confirm_transaction')}
      action_message={t('remove_rental_modal.action')}
      className={styles.content}
      {...props}
    >
      <>
        <p>{t('remove_rental_modal.question')}</p>
        <p>{t('remove_rental_modal.disclaimer')}</p>
      </>
    </SubmitTransactionModal>
  )
}

export default React.memo(RemoveRentalModal)
