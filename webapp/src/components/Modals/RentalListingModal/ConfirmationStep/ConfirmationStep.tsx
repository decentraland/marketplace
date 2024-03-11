import React, { useCallback } from 'react'
import { Modal, Button, ModalNavigation, Message } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { UpsertRentalOptType } from '../../../../modules/rental/types'
import { daysByPeriod } from '../../../../modules/rental/utils'
import { Mana } from '../../../Mana'
import { Props } from './ConfirmationStep.types'
import styles from './ConfirmationStep.module.css'

const ConfirmationStep = (props: Props) => {
  const { onCancel, isSigning, nft, pricePerDay, periods, expiresAt, onCreate, onClearRentalErros, error } = props

  const handleSubmit = useCallback(
    () => onCreate(nft, pricePerDay, periods, expiresAt, UpsertRentalOptType.INSERT),
    [nft, pricePerDay, periods, expiresAt, onCreate]
  )

  const onBack = useCallback(() => {
    onClearRentalErros()
    onCancel()
  }, [onCancel, onClearRentalErros])

  return (
    <>
      <ModalNavigation title={t('rental_modal.confirmation_step.title')} onClose={!isSigning ? onBack : undefined} />
      <Modal.Content>
        <div className={styles.notice}>
          <p>
            {t('rental_modal.confirmation_step.notice_line_one')}&nbsp;
            <b>{t('rental_modal.confirmation_step.notice_line_two')}</b>
          </p>
          <div className={styles.noticeBlock}>
            <div className={styles.noticeRow}>
              <div className={styles.noticeLabel}>{t('rental_modal.confirmation_step.price_per_day')}</div>
              <div className={styles.noticeText}>
                <Mana inline>{pricePerDay}</Mana>/{t('global.day')}
              </div>
            </div>
            <div className={styles.noticeRow}>
              <div className={styles.noticeLabel}>{t('rental_modal.confirmation_step.periods')}</div>
              <div className={styles.noticeText}>
                {periods.map(period => daysByPeriod[period]).join(' / ')}&nbsp;
                {t('global.days')}
              </div>
            </div>
            <div className={styles.noticeRow}>
              <div className={styles.noticeLabel}>{t('rental_modal.confirmation_step.listing_expiration_date')}</div>
              <div className={styles.noticeText} title={new Date(expiresAt).toString()}>
                {new Date(expiresAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button primary loading={isSigning} onClick={handleSubmit} disabled={isSigning} fluid>
          {t('global.confirm')}
        </Button>
        <Button fluid onClick={onBack} disabled={isSigning}>
          {t('global.back')}
        </Button>
      </Modal.Actions>
      {error && (
        <Modal.Content>
          <Message error size="tiny" visible content={error} header={t('global.error')} />
        </Modal.Content>
      )}
    </>
  )
}

export default React.memo(ConfirmationStep)
