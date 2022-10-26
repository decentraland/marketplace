import { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import intlFormat from 'date-fns/intlFormat'
import formatDistance from 'date-fns/formatDistance'
import { RentalListingPeriod, RentalStatus } from '@dcl/schemas'
import { Button, Popup } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { formatWeiMANA } from '../../../lib/mana'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { VendorName } from '../../../modules/vendor'
import { Section } from '../../../modules/vendor/decentraland'
import {
  getMaxPriceOfPeriods,
  getRentalEndDate
} from '../../../modules/rental/utils'
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

const LinkedProfile = ({ address }: { address: string }) => {
  return (
    <Link
      to={locations.account(address, {
        assetType: AssetType.NFT,
        vendor: VendorName.DECENTRALAND,
        section: Section.ALL
      })}
    >
      <span className={styles.profile}>
        <Profile hasPopup={true} address={address} />
      </span>
    </Link>
  )
}

export const Rent = (props: Props) => {
  const {
    className,
    isClaimingLandBack,
    onClaimLand,
    onCreateOrEditRent,
    rental,
    nft
  } = props
  const isMobileView = isMobile()

  const wrapDisabledMobileButton = useCallback(
    trigger => {
      return (
        <Popup
          content={t('asset_page.sales_rent_action_box.mobile_coming_soon')}
          position="top left"
          on="click"
          disabled={!isMobileView}
          trigger={trigger}
        />
      )
    },
    [isMobileView]
  )

  const handleOnCreateOrEdit = useCallback(
    () => onCreateOrEditRent(nft, rental),
    [nft, onCreateOrEditRent, rental]
  )
  const handleListForRentAgain = useCallback(() => undefined, [])
  const handleViewTransaction = useCallback(() => undefined, [])
  const maxPriceOfPeriods: string | null = useMemo(
    () => (rental ? getMaxPriceOfPeriods(rental) : null),
    [rental]
  )
  const rentalEndDate: Date | null = useMemo(
    () => (rental ? getRentalEndDate(rental) : null),
    [rental]
  )
  const rentalPeriods: string | null = useMemo(
    () =>
      rental
        ? rental.periods
            .sort(sortPeriods)
            .map(period => period.minDays)
            .join(' / ')
        : null,
    [rental]
  )

  return (
    <section className={classNames(styles.box, className)}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {rental
            ? t('manage_asset_page.rent.renting_title')
            : t('manage_asset_page.rent.rent_title')}
        </h1>
        <div className={styles.action}>
          {wrapDisabledMobileButton(
            <div>
              {rental ? (
                <IconButton
                  iconName="pencil"
                  onClick={handleOnCreateOrEdit}
                  disabled={isMobileView}
                />
              ) : (
                <Button
                  className={styles.actionButton}
                  onClick={handleOnCreateOrEdit}
                  disabled={isMobileView}
                >
                  {t('manage_asset_page.rent.list_for_rent')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {rental ? (
        <div className={styles.content}>
          {rental.status === RentalStatus.EXECUTED ? (
            <div className={styles.activeRent}>
              {rental.startedAt && isClaimingLandBack ? (
                <>
                  <div>{t('manage_asset_page.rent.claiming_land')}</div>
                  <div className={styles.activeRentActions}>
                    <Button
                      className={styles.actionButton}
                      onClick={handleViewTransaction}
                    >
                      {t('manage_asset_page.rent.view_transaction')}
                    </Button>
                  </div>
                </>
              ) : rentalEndDate && rentalEndDate.getTime() <= Date.now() ? (
                <>
                  <div className={styles.rentMessage}>
                    <T
                      id="manage_asset_page.rent.rent_end"
                      values={{
                        tenant: <LinkedProfile address={rental.tenant!} />
                      }}
                    />
                  </div>
                  <div className={styles.activeRentActions}>
                    {wrapDisabledMobileButton(
                      <div>
                        <Button
                          className={styles.actionButton}
                          onClick={onClaimLand}
                        >
                          {t('manage_asset_page.rent.claim_land')}
                        </Button>
                      </div>
                    )}
                    {wrapDisabledMobileButton(
                      <div>
                        <Button
                          className={styles.actionButton}
                          onClick={handleListForRentAgain}
                        >
                          {t('manage_asset_page.rent.list_for_rent_again')}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : rentalEndDate && rentalEndDate.getTime() > Date.now() ? (
                <div className={styles.rentMessage}>
                  <T
                    id="manage_asset_page.rent.rented_until"
                    values={{
                      date: intlFormat(rentalEndDate!, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }),
                      tenant: <LinkedProfile address={rental.tenant!} />
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
          {!isClaimingLandBack ? (
            <div className={styles.summary}>
              <div
                className={classNames(
                  styles.column,
                  styles.notShrink,
                  styles.priceColumn
                )}
              >
                <div className={styles.columnHeader}>
                  {t('manage_asset_page.rent.price')}
                </div>
                <div className={styles.columnContent}>
                  <Mana withTooltip size={'medium'} network={rental.network}>
                    {formatWeiMANA(maxPriceOfPeriods!)}
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
                    <div className={styles.columnContent}>{rentalPeriods}</div>
                  </div>
                </>
              ) : rental.status === RentalStatus.EXECUTED ? (
                <>
                  <div
                    className={classNames(
                      styles.column,
                      styles.shrinkAndExpand
                    )}
                  >
                    <div className={styles.columnHeader}>
                      {t('manage_asset_page.rent.start_date')}
                    </div>
                    <div className={styles.columnContent}>
                      {formatDistance(rental.startedAt!, new Date(), {
                        addSuffix: true
                      })}
                    </div>
                    <div
                      className={classNames(styles.columnContent, styles.date)}
                    >
                      ({intlFormat(rental.startedAt!)})
                    </div>
                  </div>
                  <div
                    className={classNames(
                      styles.column,
                      styles.shrinkAndExpand
                    )}
                  >
                    <div className={styles.columnHeader}>
                      {t('manage_asset_page.rent.end_date')}
                    </div>
                    <div className={styles.columnContent}>
                      {formatDistance(new Date(), rentalEndDate!, {
                        addSuffix: true
                      })}
                    </div>
                    <div
                      className={classNames(styles.columnContent, styles.date)}
                    >
                      ({intlFormat(rentalEndDate!)})
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
