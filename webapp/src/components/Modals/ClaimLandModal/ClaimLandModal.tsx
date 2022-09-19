import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ClaimLandModal.types'
import styles from './ClaimLandModal.module.css'
import { SubmitTransactionModal } from '../SubmitTransactionModal'

const ClaimLandModal = ({ ...props }: Props) => {
  return (
    <SubmitTransactionModal
      title={t('claim_land_modal.title')}
      confirm_transaction_message={t('claim_land_modal.confirm_transaction')}
      action_message={t('claim_land_modal.action')}
      className={styles.content}
      {...props}
    >
      <>
        <p>{t('claim_land_modal.question')}</p>
        <p>{t('claim_land_modal.disclaimer')}</p>
      </>
    </SubmitTransactionModal>
  )
}

export default React.memo(ClaimLandModal)
