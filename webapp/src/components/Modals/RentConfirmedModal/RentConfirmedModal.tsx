import React from 'react'
import add from 'date-fns/add'
import format from 'date-fns/format'
import { ModalNavigation, Close } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { builderUrl } from '../../../lib/environment'
import { CTAProps, Props } from './RentConfirmedModal.types'
import styles from './RentConfirmedModal.module.css'
import CTA from './CTA'

const CTAs: CTAProps[] = [
  {
    to: builderUrl,
    icon: 'build-more',
    index: 0
  },
  {
    to:
      'https://docs.decentraland.org/creator/development-guide/coding-scenes/',
    icon: 'get-creative',
    index: 1
  },
  {
    to: `${builderUrl}/land`,
    icon: 'manage-land',
    index: 2
  }
]

const RentConfirmedModal = ({
  metadata: { rental, periodIndexChosen },
  onClose
}: Props) => {
  const period = rental.periods[periodIndexChosen]
  const startDate = new Date()
  const endDate = add(startDate, { days: period.maxDays })

  return (
    <Modal
      size="tiny"
      className={styles.modal}
      name={t('rental_modal.rent_confirmed_step.title')}
      onClose={onClose}
      closeIcon={<Close />}
    >
      <ModalNavigation title={t('rental_modal.rent_confirmed_step.title')} />
      <Modal.Content>
        <div>
          <div className={styles.textContainer}>
            <T
              id="rental_modal.rent_confirmed_step.subtitle"
              values={{ end_date: <b>{format(endDate, 'MMM dd')}.</b> }}
            />
          </div>
          <div>
            <CTA cta={CTAs[0]} />
            <CTA cta={CTAs[1]} />
            <CTA cta={CTAs[2]} />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default React.memo(RentConfirmedModal)
