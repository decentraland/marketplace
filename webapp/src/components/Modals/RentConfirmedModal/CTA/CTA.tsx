import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import styles from './CTA.module.css'
import { Props } from './CTA.types'

const CTA = ({ to, name, isDisabledOnMobile }: Props) => {
  const renderContent = () => (
    <>
      <div className={classNames(styles[name], styles.icon)} />
      <div className={styles.ctaTextContainer}>
        <span>{t(`rental_modal.rent_confirmed_step.${name}.title`)}</span>
        <span className={styles.ctaSubtitle}>
          {t(`rental_modal.rent_confirmed_step.${name}.subtitle`)}
        </span>
        {isDisabledOnMobile && (
          <span className={styles.ctaSubtitleMobile}>
            <i className={styles.infoIcon} />
            {t(`rental_modal.rent_confirmed_step.onlyAvailableOnDesktop`)}
          </span>
        )}
      </div>
    </>
  )

  return isDisabledOnMobile ? (
    <div className={styles.mobileAvailabilityContainer}>{renderContent()}</div>
  ) : (
    <a
      className={styles.ctaContainer}
      href={to}
      target="_blank"
      rel="noreferrer"
    >
      {renderContent()}
    </a>
  )
}

export default CTA
