import React from 'react'
import classNames from 'classnames'
import add from 'date-fns/add'
import format from 'date-fns/format'
import { ModalNavigation, Close } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { builderUrl } from '../../../lib/environment'
import { Props } from './RentConfirmedModal.types'
import styles from './RentConfirmedModal.module.css'

const CTAs = [
  {
    to: `${builderUrl}/scenes`,
    icon: 'build-more'
  },
  {
    to:
      'https://docs.decentraland.org/creator/development-guide/coding-scenes/',
    icon: 'get-creative'
  },
  {
    to: `${builderUrl}/land`,
    icon: 'manage-land'
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
            {CTAs.map((cta, i) => (
              <a
                key={cta.icon}
                className={styles.ctaContainer}
                href={cta.to}
                target="_blank"
                rel="noreferrer"
              >
                <div className={classNames(styles[cta.icon], styles.icon)} />
                <div className={styles.ctaTextContainer}>
                  <span>
                    {t(
                      `rental_modal.rent_confirmed_step.action_${i + 1}.title`
                    )}
                  </span>
                  <span className={styles.ctaSubtitle}>
                    {t(
                      `rental_modal.rent_confirmed_step.action_${i +
                        1}.subtitle`
                    )}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default React.memo(RentConfirmedModal)
