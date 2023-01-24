import React from 'react'
import classNames from 'classnames'
import add from 'date-fns/add'
import format from 'date-fns/format'
import { ModalNavigation, Close, useMobileMediaQuery } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { builderUrl } from '../../../lib/environment'
import { Props } from './RentConfirmedModal.types'
import styles from './RentConfirmedModal.module.css'

type CTAProps = {
  to: string
  icon: string
}

type WrapperProps = {
  cta: CTAProps
  i: number
  children: React.ReactNode
}

const CTAs: CTAProps[] = [
  {
    to: builderUrl,
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

  const isMobileView = useMobileMediaQuery()

  const Wrapper = ({ children, cta, i }: WrapperProps) =>
    isMobileView && i !== 1 ? (
      <div className={styles.mobileAvailabilityContainer}>{children}</div>
    ) : (
      <a
        key={cta.icon}
        className={styles.ctaContainer}
        href={cta.to}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    )

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
              <Wrapper cta={cta} i={i}>
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
                  {isMobileView && (
                    <span className={styles.ctaSubtitleMobile}>
                      <i className={styles.infoIcon} />
                      {t(
                        `rental_modal.rent_confirmed_step.onlyAvailableOnDesktop`
                      )}
                    </span>
                  )}
                </div>
              </Wrapper>
            ))}
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default React.memo(RentConfirmedModal)
