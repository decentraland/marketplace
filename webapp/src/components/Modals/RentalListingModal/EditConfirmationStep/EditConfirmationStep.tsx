import React, { useCallback, useEffect, useState } from 'react'
import { Modal, Button, ModalNavigation, Message, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './EditConfirmationStep.types'
import styles from './EditConfirmationStep.module.css'
import { UpsertRentalOptType } from '../../../../modules/rental/types'

const EditConfirmationStep = (props: Props) => {
  const {
    onCancel,
    isSigning,
    nft,
    pricePerDay,
    periods,
    expiresAt,
    onEdit,
    onRemove,
    isRemoveTransactionBeingConfirmed,
    isSubmittingRemoveTransaction,
    error
  } = props

  const [hasTriggeredStepOne, setHasTriggeredStepOne] = useState(false)
  const [isStepOneCompleted, setIsStepOneCompleted] = useState(false)

  useEffect(() => {
    if (isRemoveTransactionBeingConfirmed) {
      setHasTriggeredStepOne(true)
    }
  }, [isRemoveTransactionBeingConfirmed, isSubmittingRemoveTransaction])

  useEffect(() => {
    if (
      hasTriggeredStepOne &&
      !isRemoveTransactionBeingConfirmed &&
      !isSubmittingRemoveTransaction
    ) {
      setIsStepOneCompleted(true)
    }
  }, [
    hasTriggeredStepOne,
    isRemoveTransactionBeingConfirmed,
    isSubmittingRemoveTransaction
  ])

  const handleRemove = useCallback(() => onRemove(nft), [nft, onRemove])

  const handlePublishNewInfo = useCallback(() => {
    onEdit(
      nft,
      pricePerDay,
      periods,
      Number(new Date(expiresAt)),
      UpsertRentalOptType.EDIT
    )
  }, [onEdit, nft, pricePerDay, periods, expiresAt])

  return (
    <>
      <ModalNavigation
        title={t('rental_modal.confirmation_edit_step.title')}
        onClose={onCancel}
      />
      <Modal.Content>
        <div className={styles.notice}>
          <p>
            {t('rental_modal.confirmation_edit_step.notice_line_one')}&nbsp;
          </p>
          <div className={styles.noticeBlock}>
            <div className={styles.actionContainer}>
              <div className={styles.actionContainerText}>
                <span className={styles.step}>1</span>
                <div>
                  <span>
                    {t('rental_modal.confirmation_edit_step.action_one_title')}
                  </span>
                  <span className={styles.stepSubtitle}>
                    {t(
                      'rental_modal.confirmation_edit_step.action_one_subtitle'
                    )}
                  </span>
                </div>
              </div>
              {!isStepOneCompleted ? (
                <Button
                  primary
                  size="small"
                  onClick={handleRemove}
                  loading={
                    isSubmittingRemoveTransaction ||
                    isRemoveTransactionBeingConfirmed
                  }
                  disabled={isStepOneCompleted}
                >
                  {t('rental_modal.confirmation_edit_step.confirm')}
                </Button>
              ) : (
                <>
                  <Icon className={styles.checkIcon} name="check" />
                  <span>{t('rental_modal.confirmation_edit_step.done')}</span>
                </>
              )}
            </div>
          </div>
          <div className={styles.noticeBlock}>
            <div className={styles.actionContainer}>
              <div className={styles.actionContainerText}>
                <span className={styles.step}>2</span>
                <div>
                  <span>
                    {t('rental_modal.confirmation_edit_step.action_two_title')}
                  </span>
                </div>
              </div>
              <Button
                primary={isStepOneCompleted}
                size="small"
                loading={isSigning}
                disabled={!isStepOneCompleted}
                onClick={handlePublishNewInfo}
              >
                {t('rental_modal.confirmation_edit_step.action_two_title')}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Content>
      {error && (
        <Modal.Content>
          <Message
            error
            size="tiny"
            visible
            content={error}
            header={t('global.error')}
          />
        </Modal.Content>
      )}
    </>
  )
}

export default React.memo(EditConfirmationStep)
