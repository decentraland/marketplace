import { useCallback, useState } from 'react'
import { RentalListingPeriod, RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import classNames from 'classnames'
import intlFormat from 'date-fns/intlFormat'
import formatDistance from 'date-fns/formatDistance'
import { formatWeiMANA } from '../../../lib/mana'
import { getMaxPriceOfPeriods } from '../../../modules/rental/utils'
import { CreateRentalModal } from '../../CreateRentalModal'
import { Mana } from '../../Mana'
import { IconButton } from '../IconButton'
import styles from './Rent.module.css'
import { Props } from './Rent.types'

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
  const { className, rental, nft } = props

  const handleOnEdit = useCallback(() => undefined, [])
  const handleListForRent = useCallback(() => {
    setIsCreateRentalModalOpen(true)
  }, [])
  const handleCreateRentalListingCancel = useCallback(() => {
    setIsCreateRentalModalOpen(false)
  }, [])
  const [isCreateRentalModalOpen, setIsCreateRentalModalOpen] = useState(false)

  return (
    <section className={classNames(styles.box, className)}>
      <CreateRentalModal
        nft={nft}
        open={isCreateRentalModalOpen}
        onCancel={handleCreateRentalListingCancel}
      />
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
            <Button className={styles.listForRent} onClick={handleListForRent}>
              {t('manage_asset_page.rent.list_for_rent')}
            </Button>
          )}
        </div>
      </div>
      {rental ? (
        <div className={styles.content}>
          <div className={classNames(styles.column, styles.notShrink)}>
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
              <div className={classNames(styles.column, styles.notShrink)}>
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
                  {/* The end date does not exist in the current rental format and can not be computed at the moment */}
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
