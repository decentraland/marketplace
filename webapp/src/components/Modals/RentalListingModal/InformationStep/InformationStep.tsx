import React from 'react'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal, Button, ModalNavigation } from 'decentraland-ui'
import { Props } from './InformationStep.types'
import styles from './InformationStep.module.css'

const InformationStep = (props: Props) => {
  const { onCancel, nft, handleSubmit } = props

  return (
    <>
      <ModalNavigation title={t('rental_modal.authorization_step_again.title')} onClose={onCancel} />
      <Modal.Content>
        <div className={styles.contentContainerRentAgain}>
          <span>
            <T
              id="rental_modal.authorization_step_again.notice_line_one"
              values={{
                assetType: t(`global.${nft.category}`)
              }}
            />
          </span>
          <span>
            <T
              id="rental_modal.authorization_step_again.notice_line_two"
              values={{
                assetType: t(`global.${nft.category}`)
              }}
            />
          </span>
          <div className={styles.rentAgainSmallText}>
            <T
              id="rental_modal.authorization_step_again.notice_line_three"
              values={{
                assetType: t(`global.${nft.category}`)
              }}
            />
          </div>
        </div>
      </Modal.Content>

      <Modal.Actions className={styles.actions}>
        <Button primary fluid onClick={handleSubmit}>
          {t('rental_modal.authorization_step_again.title')}
        </Button>
        <Button fluid onClick={onCancel}>
          {t('global.cancel')}
        </Button>
      </Modal.Actions>
    </>
  )
}

export default React.memo(InformationStep)
