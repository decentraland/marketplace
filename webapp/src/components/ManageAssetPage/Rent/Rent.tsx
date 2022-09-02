import { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import classNames from 'classnames'
import intlFormat from 'date-fns/intlFormat'
import formatDistance from 'date-fns/formatDistance'
import { formatWeiMANA } from '../../../lib/mana'
import { getMaxPriceOfPeriods } from '../../../modules/rental/utils'
import { Mana } from '../../Mana'
import { IconButton } from '../IconButton'
import styles from './Rent.module.css'
import { Props } from './Rent.types'
import { RentalListingPeriod, RentalStatus } from '@dcl/schemas'

const sortPeriods = (a: RentalListingPeriod, b: RentalListingPeriod) => {
  if (a.minDays > b.minDays) {
    return 1
  } else if (a.minDays === b.minDays) {
    return 0
  } else {
    return -1
  }
}

export const Rent = (props: Props) => {
  const { className, rental } = props
  const handleOnEdit = useCallback(() => undefined, [])

  return (
    <section className={classNames(styles.box, className)}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {rental
            ? t('manage_asset_page.rent.renting_title')
            : t('manage_asset_page.rent.rent_title')}
        </h1>
        <div className={styles.action}>
          {rental ? (
            <IconButton iconName="pencil" onClick={handleOnEdit} />
          ) : (
            <span>{t('manage_asset_page.rent.list_for_rent')}</span>
          )}
        </div>
      </div>
      {rental ? (
        <div className={styles.content}>
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              {t('manage_asset_page.rent.price')}
            </div>
            <div className={styles.columnContent}>
              <Mana withTooltip size={'medium'} network={rental.network}>
                {formatWeiMANA(getMaxPriceOfPeriods(rental))}
              </Mana>
              <span>/{t('global.day')}</span>
            </div>
          </div>
          {rental.status === RentalStatus.OPEN ? (
            <>
              <div className={styles.column}>
                <div className={styles.columnHeader}>
                  {t('manage_asset_page.rent.expiration_date')}
                </div>
                <div className={styles.columnContent}>
                  {intlFormat(rental.expiration)}
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.columnHeader}>
                  {t('manage_asset_page.rent.rent_periods')}
                </div>
                <div className={styles.columnContent}>
                  {rental.periods
                    .sort(sortPeriods)
                    .map(period => period.minDays)
                    .join(' / ')}
                </div>
              </div>
            </>
          ) : rental.status === RentalStatus.EXECUTED ? (
            <>
              <div className={styles.column}>
                <div className={styles.columnHeader}>
                  {t('manage_asset_page.rent.start_date')}
                </div>
                <div className={styles.columnContent}>
                  {formatDistance(rental.startedAt!, new Date(), {
                    addSuffix: true
                  })}
                </div>
                <div className={classNames(styles.columnContent, styles.date)}>
                  ({intlFormat(rental.startedAt!)})
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.columnHeader}>
                  {t('manage_asset_page.rent.end_date')}
                </div>
                <div className={styles.columnContent}>
                  {formatDistance(rental.startedAt!, new Date(), {
                    addSuffix: true
                  })}
                </div>
                <div className={classNames(styles.columnContent, styles.date)}>
                  ({intlFormat(rental.startedAt!)})
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
