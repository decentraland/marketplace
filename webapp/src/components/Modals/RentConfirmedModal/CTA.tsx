import { useMobileMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { CTAProps } from './RentConfirmedModal.types'
import styles from './RentConfirmedModal.module.css'
import classNames from 'classnames'

type Props = {
  cta: CTAProps
}

const CTA = ({ cta }: Props) => {
  const isMobileView = useMobileMediaQuery() && cta.index !== 1

  const renderContent = () => (
    <>
      <div className={classNames(styles[cta.icon], styles.icon)} />
      <div className={styles.ctaTextContainer}>
        <span>
          {t(`rental_modal.rent_confirmed_step.action_${cta.index + 1}.title`)}
        </span>
        <span className={styles.ctaSubtitle}>
          {t(
            `rental_modal.rent_confirmed_step.action_${cta.index + 1}.subtitle`
          )}
        </span>
        {isMobileView && (
          <span className={styles.ctaSubtitleMobile}>
            <i className={styles.infoIcon} />
            {t(`rental_modal.rent_confirmed_step.onlyAvailableOnDesktop`)}
          </span>
        )}
      </div>
    </>
  )

  return isMobileView ? (
    <div className={styles.mobileAvailabilityContainer}>{renderContent()}</div>
  ) : (
    <a
      key={cta.icon}
      className={styles.ctaContainer}
      href={cta.to}
      target="_blank"
      rel="noreferrer"
    >
      {renderContent()}
    </a>
  )
}

export default CTA
