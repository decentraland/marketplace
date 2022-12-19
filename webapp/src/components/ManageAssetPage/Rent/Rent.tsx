import { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import intlFormat from 'date-fns/intlFormat'
import formatDistance from 'date-fns/formatDistance'
import { RentalListingPeriod } from '@dcl/schemas'
import { Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getTransactionHref } from 'decentraland-dapps/dist/modules/transaction/utils'
import { formatWeiMANA } from '../../../lib/mana'
import { locations } from '../../../modules/routing/locations'
import {
  canBeClaimed,
  canCreateANewRental,
  getMaxPriceOfPeriods,
  getRentalEndDate,
  hasRentalEnded,
  isRentalListingExecuted,
  isRentalListingCancelled,
  isRentalListingOpen
} from '../../../modules/rental/utils'
import { isLand, isParcel } from '../../../modules/nft/utils'
import { LinkedProfile } from '../../LinkedProfile'
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
  const {
    className,
    onClaimLand,
    onCreateOrEditRent,
    rental,
    nft,
    isClaimingBackLandTransactionPending,
    claimingBackLandTransaction,
    wallet
  } = props
  const assetText = isParcel(nft) ? t('global.parcel') : t('global.estate')

  const handleOnCreateOrEdit = useCallback(
    () => onCreateOrEditRent(nft, rental),
    [nft, onCreateOrEditRent, rental]
  )
  const claimingBackLandTransactionLink = claimingBackLandTransaction
    ? getTransactionHref(
        {
          txHash:
            claimingBackLandTransaction.replacedBy ||
            claimingBackLandTransaction.hash
        },
        claimingBackLandTransaction.chainId
      )
    : ''
  const rentalEndDate: Date | null = useMemo(
    () => (rental && rental.startedAt ? getRentalEndDate(rental) : null),
    [rental]
  )
  const rentalEnded = useMemo(() => rental && hasRentalEnded(rental), [rental])
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
  const canBeClaimedBack =
    wallet && rental && canBeClaimed(wallet.address, rental, nft)

  const rentButton = useMemo(() => {
    if (canCreateANewRental(rental)) {
      return (
        <Button className={styles.actionButton} onClick={handleOnCreateOrEdit}>
          {t('manage_asset_page.rent.list_for_rent')}
        </Button>
      )
    }
    if (rental && isRentalListingOpen(rental)) {
      return <IconButton iconName="pencil" onClick={handleOnCreateOrEdit} />
    }
  }, [handleOnCreateOrEdit, rental])

  return (
    <section className={classNames(styles.box, className)}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {rental && !isRentalListingCancelled(rental)
            ? t('manage_asset_page.rent.renting_title')
            : t('manage_asset_page.rent.rent_title')}
        </h1>
        <div className={styles.right}>
          {rental && isRentalListingOpen(rental) ? (
            <Button
              className={styles.actionButton}
              as={Link}
              to={locations.nft(nft.contractAddress, nft.tokenId)}
            >
              {t('manage_asset_page.rent.view_listing')}
            </Button>
          ) : null}
          <div className={styles.action}>
            <div>{rentButton}</div>
          </div>
        </div>
      </div>
      {rental ? (
        <div className={styles.content}>
          {isRentalListingExecuted(rental) && !rentalEnded ? (
            <div className={styles.activeRent}>
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
                    tenant: (
                      <LinkedProfile
                        className={styles.rentedBy}
                        address={rental.tenant!}
                      />
                    )
                  }}
                />
              </div>
            </div>
          ) : null}
          {canBeClaimedBack ? (
            <div className={styles.activeRent}>
              {isClaimingBackLandTransactionPending ? (
                <>
                  <div className={styles.rentMessage}>
                    {t('manage_asset_page.rent.claiming_land', {
                      asset: assetText
                    })}
                  </div>
                  <div className={styles.activeRentActions}>
                    <Button
                      as={'a'}
                      basic
                      className={styles.actionButtonBasicPadding}
                      href={claimingBackLandTransactionLink}
                      target="_blank"
                    >
                      {t('manage_asset_page.rent.view_transaction')}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.rentMessage}>
                    {rentalEnded ? (
                      <T
                        id="manage_asset_page.rent.rent_end"
                        values={{
                          tenant: (
                            <LinkedProfile
                              className={styles.rentedBy}
                              address={rental.tenant!}
                            />
                          ),
                          asset: assetText
                        }}
                      />
                    ) : (
                      t('manage_asset_page.rent.unclaimed_message', {
                        asset: isLand(nft)
                          ? t('global.the_parcel')
                          : t('global.the_estate')
                      })
                    )}
                  </div>
                  <div className={styles.activeRentActions}>
                    <div>
                      <Button
                        className={styles.actionButton}
                        onClick={onClaimLand}
                      >
                        {t('manage_asset_page.rent.claim_asset', {
                          asset: assetText
                        })}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}
          {!isClaimingBackLandTransactionPending &&
          (isRentalListingOpen(rental) ||
            (!canBeClaimedBack && !isRentalListingCancelled(rental))) ? (
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
                  <Mana
                    withTooltip
                    size={'medium'}
                    className={styles.price}
                    network={rental.network}
                  >
                    {formatWeiMANA(getMaxPriceOfPeriods(rental))}
                  </Mana>
                  <span>/{t('global.day')}</span>
                </div>
              </div>
              {isRentalListingOpen(rental) ? (
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
              ) : isRentalListingExecuted(rental) ? (
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
                      {formatDistance(rentalEndDate!, new Date(), {
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
