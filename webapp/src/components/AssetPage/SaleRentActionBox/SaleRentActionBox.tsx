import { memo, useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { formatWeiMANA } from '../../../lib/mana'
import { getMaxPriceOfPeriods } from '../../../modules/rental/utils'
import { VendorFactory } from '../../../modules/vendor'
import { locations } from '../../../modules/routing/locations'
import { Mana } from '../../Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { PeriodsDropdown } from './PeriodsDropdown'
import { Props } from './SaleRentActionBox.types'
import styles from './SaleRentActionBox.module.css'

enum View {
  SALE,
  RENT
}

const SaleRentActionBox = ({
  nft,
  order,
  rental,
  isOwner,
  userHasAlreadyBidsOnNft,
  isRentalsEnabled
}: Props) => {
  console.log('Order', order)
  const [selectedRentalPeriodIndex, setSelectedRentalPeriodIndex] = useState<
    number
  >(0)
  const [view, setView] = useState(View.SALE)
  const handleOnRent = useCallback(
    () => rental?.periods[selectedRentalPeriodIndex],
    [rental, selectedRentalPeriodIndex]
  )
  const maxPriceOfPeriods: string | null = useMemo(
    () => (rental ? getMaxPriceOfPeriods(rental) : null),
    [rental]
  )
  const toggleView = useCallback(
    () => (view === View.RENT ? setView(View.SALE) : setView(View.RENT)),
    [view]
  )

  // Validations for the sale screen
  const { bidService } = useMemo(() => VendorFactory.build(nft.vendor), [nft])
  const isBiddable = bidService !== undefined
  const canBid = isBiddable && !userHasAlreadyBidsOnNft

  return (
    <>
      {rental && maxPriceOfPeriods && isRentalsEnabled ? (
        <div className={styles.viewSelector}>
          <button
            onClick={toggleView}
            disabled={view === View.SALE}
            className={classNames(styles.viewOption, {
              [styles.selectedViewOption]: view === View.SALE
            })}
          >
            {t('global.sale')}
          </button>
          <button
            onClick={toggleView}
            disabled={view === View.RENT}
            className={classNames(styles.viewOption, {
              [styles.selectedViewOption]: view === View.RENT
            })}
          >
            {t('global.rent')}
          </button>
        </div>
      ) : null}
      {view === View.RENT && rental && maxPriceOfPeriods && isRentalsEnabled ? (
        <>
          <div className={styles.price}>
            <div className={styles.title}>{t('global.price')}</div>
            <div className={styles.priceValue}>
              <Mana
                className={styles.priceInMana}
                withTooltip
                size="medium"
                network={rental.network}
              >
                {formatWeiMANA(maxPriceOfPeriods)}
              </Mana>
              <span className={styles.perDay}>/{t('global.day')}</span>
              <span className={styles.priceInFiat}>
                (<ManaToFiat mana={maxPriceOfPeriods} />/{t('global.day')})
              </span>
            </div>
          </div>
          <PeriodsDropdown
            onChange={setSelectedRentalPeriodIndex}
            value={selectedRentalPeriodIndex}
            periods={rental.periods}
            className={styles.periodsDropdown}
          />
          {!isOwner ? (
            <Button primary onClick={handleOnRent} className={styles.rent}>
              {t('global.rent')}
            </Button>
          ) : null}
        </>
      ) : (
        <>
          {order ? (
            <div className={styles.price}>
              <div className={styles.title}>{t('global.price')}</div>
              <div className={styles.priceValue}>
                <Mana
                  className={styles.priceInMana}
                  withTooltip
                  size="medium"
                  network={order.network}
                >
                  {formatWeiMANA(order.price)}
                </Mana>
                <span className={styles.priceInFiat}>
                  (<ManaToFiat mana={order.price} />)
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.notForSale}>
              {t('asset_page.sales_rent_action_box.not_for_sale')}
            </div>
          )}
          {!isOwner ? (
            <div className={styles.saleButtons}>
              {order ? (
                <Button className={styles.buy} primary fluid>
                  {t('asset_page.actions.buy')}
                </Button>
              ) : null}
              {canBid ? (
                <Button
                  className={classNames({ [styles.bid]: order })}
                  primary={!order}
                  fluid
                >
                  {t('asset_page.actions.bid')}
                </Button>
              ) : null}
            </div>
          ) : null}
        </>
      )}
      {isOwner ? (
        <Button
          as={Link}
          to={locations.manage(nft.contractAddress, nft.tokenId)}
          fluid
          className={styles.manage}
        >
          {t('asset_page.actions.manage')}
        </Button>
      ) : null}
    </>
  )
}

export default memo(SaleRentActionBox)
