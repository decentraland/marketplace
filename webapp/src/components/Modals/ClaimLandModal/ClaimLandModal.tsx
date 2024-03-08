import React from 'react'
import { isParcel } from '../../../modules/nft/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ClaimLandModal.types'
import styles from './ClaimLandModal.module.css'
import { SubmitTransactionModal } from '../SubmitTransactionModal'

const ClaimLandModal = ({ ...props }: Props) => {
  const assetText = isParcel(props.metadata.nft) ? t('global.parcel') : t('global.estate')
  return (
    <SubmitTransactionModal
      title={t('claim_land_modal.title', {
        asset: assetText
      })}
      confirm_transaction_message={t('claim_land_modal.confirm_transaction')}
      action_message={t('claim_land_modal.action', { asset: assetText })}
      className={styles.content}
      {...props}
    >
      <>
        <p>{t('claim_land_modal.question', { asset: assetText })}</p>
        <p>{t('claim_land_modal.disclaimer')}</p>
      </>
    </SubmitTransactionModal>
  )
}

export default React.memo(ClaimLandModal)
