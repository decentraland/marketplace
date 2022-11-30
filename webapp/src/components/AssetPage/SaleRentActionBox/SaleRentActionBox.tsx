import { memo, useCallback, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import intlFormat from 'date-fns/intlFormat'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Button, Popup } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { formatWeiMANA } from '../../../lib/mana'
import {
  getMaxPriceOfPeriods,
  getRentalEndDate,
  hasRentalEnded,
  isRentalListingExecuted,
  isRentalListingOpen
} from '../../../modules/rental/utils'
import { getContractNames, VendorFactory } from '../../../modules/vendor'
import { getContractAuthorization } from '../../../lib/authorization'
import { locations } from '../../../modules/routing/locations'
import { isParcel, isPartOfEstate } from '../../../modules/nft/utils'
import { AssetType } from '../../../modules/asset/types'
import { isOwnedBy } from '../../../modules/asset/utils'
import { Mana } from '../../Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { AuthorizationModal } from '../../AuthorizationModal'
import { PeriodsDropdown } from './PeriodsDropdown'
import { Props } from './SaleRentActionBox.types'
import styles from './SaleRentActionBox.module.css'

enum View {
  SALE,
  RENT
}

const SaleRentActionBox = ({
  nft,
  wallet,
  authorizations,
  order,
  rental,
  userHasAlreadyBidsOnNft,
  isRentalsEnabled,
  currentMana,
  getContract,
  onRent
}: Props) => {
  const isMobileView = isMobile()
  const isRentalOpen = isRentalListingOpen(rental)
  const isOwner = isOwnedBy(nft, wallet, rental ? rental : undefined)

  const [selectedRentalPeriodIndex, setSelectedRentalPeriodIndex] = useState<
    number
  >(0)
  const [view, setView] = useState(
    !!order || !isRentalOpen ? View.SALE : View.RENT
  )
  const maxPriceOfPeriods: string | null = useMemo(
    () => (rental ? getMaxPriceOfPeriods(rental) : null),
    [rental]
  )
  const toggleView = useCallback(
    () => (view === View.RENT ? setView(View.SALE) : setView(View.RENT)),
    [view]
  )
  const isNFTPartOfAState = useMemo(() => isPartOfEstate(nft), [nft])

  // Validations for the sale screen
  const { bidService } = useMemo(() => VendorFactory.build(nft.vendor), [nft])
  const isBiddable = bidService !== undefined
  const canBid = !isOwner && isBiddable && !userHasAlreadyBidsOnNft
  const isCurrentlyRented = isRentalListingExecuted(rental)
  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)
  const authorization = useMemo(() => {
    if (!wallet) {
      return null
    }

    const contractNames = getContractNames()
    const mana = getContract({
      name: contractNames.MANA,
      network: nft.network
    })
    const rentals = getContract({
      name: getContractNames().RENTALS,
      network: nft.network
    })
    return getContractAuthorization(
      wallet.address,
      rentals?.address,
      mana ? { ...mana, name: ContractName.MANAToken } : undefined
    )
  }, [wallet, getContract, nft.network])

  const handleOnRent = useCallback(() => {
    if (!!authorization && hasAuthorization(authorizations, authorization)) {
      setShowAuthorizationModal(false)
      onRent(selectedRentalPeriodIndex)
    } else {
      setShowAuthorizationModal(true)
    }
  }, [authorization, authorizations, onRent, selectedRentalPeriodIndex])

  const handleCloseAuthorizationModal = () => setShowAuthorizationModal(false)

  const rentalEndTime = isCurrentlyRented
    ? getRentalEndDate(rental!)!.getTime()
    : 0
  const rentalHasEnded = isCurrentlyRented && hasRentalEnded(rental!)
  const hasEnoughManaToRent = useMemo(
    () =>
      !!rental &&
      !!currentMana &&
      ethers.BigNumber.from(currentMana).gte(
        ethers.utils.formatEther(
          ethers.BigNumber.from(
            rental.periods[selectedRentalPeriodIndex].pricePerDay
          ).mul(rental.periods[selectedRentalPeriodIndex].maxDays)
        )
      ),
    [rental, currentMana, selectedRentalPeriodIndex]
  )
  const hasEnoughManaToBuy = useMemo(
    () =>
      !!order &&
      !!currentMana &&
      ethers.BigNumber.from(currentMana).gte(
        ethers.utils.formatEther(order.price)
      ),
    [order, currentMana]
  )

  return (
    <div className={styles.main}>
      <div className={styles.actions}>
        {isRentalOpen && maxPriceOfPeriods && isRentalsEnabled ? (
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
        {view === View.RENT &&
        isRentalOpen &&
        maxPriceOfPeriods &&
        isRentalsEnabled ? (
          <>
            <div className={styles.price}>
              <div className={styles.title}>{t('global.price')}</div>
              <div className={styles.priceValue}>
                <Mana
                  className={styles.priceInMana}
                  withTooltip
                  size="medium"
                  network={rental!.network}
                >
                  {formatWeiMANA(maxPriceOfPeriods)}
                </Mana>
                <span className={styles.perDay}>/{t('global.day')}</span>
                <span className={styles.priceInFiat}>
                  (<ManaToFiat mana={maxPriceOfPeriods} />/{t('global.day')})
                </span>
              </div>
            </div>
            <div className={styles.periodTitle}>{t('global.period')}</div>
            <PeriodsDropdown
              onChange={setSelectedRentalPeriodIndex}
              value={selectedRentalPeriodIndex}
              periods={rental!.periods}
              className={styles.periodsDropdown}
            />
            {!isOwner ? (
              <>
                <Popup
                  content={
                    isMobileView
                      ? t(
                          'asset_page.sales_rent_action_box.mobile_coming_soon',
                          {
                            asset: isParcel(nft)
                              ? t('global.land')
                              : t('global.estate')
                          }
                        )
                      : t(
                          'asset_page.sales_rent_action_box.parcel_belongs_to_estate_rent'
                        )
                  }
                  position="top center"
                  on={isMobileView ? 'click' : 'hover'}
                  disabled={!isMobileView && !isNFTPartOfAState}
                  trigger={
                    <div className={styles.fullWidth}>
                      <Button
                        primary
                        disabled={
                          isMobileView ||
                          isNFTPartOfAState ||
                          !hasEnoughManaToRent
                        }
                        onClick={handleOnRent}
                        className={styles.rent}
                      >
                        {t('global.rent')}
                      </Button>
                    </div>
                  }
                />
                {!hasEnoughManaToRent ? (
                  <div className={styles.notEnoughMana}>
                    {t('asset_page.sales_rent_action_box.not_enough_mana')}
                  </div>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <>
            {order ? (
              <div className={styles.price}>
                <div className={styles.title}>{t('global.price')}</div>
                <div className={styles.content}>
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
              <>
                <div className={styles.saleButtons}>
                  {order ? (
                    <Button
                      as={Link}
                      to={locations.buy(
                        AssetType.NFT,
                        nft.contractAddress,
                        nft.tokenId
                      )}
                      disabled={!hasEnoughManaToBuy}
                      className={styles.buy}
                      primary
                      fluid
                    >
                      {t('asset_page.actions.buy')}
                    </Button>
                  ) : null}
                  {canBid ? (
                    <Popup
                      content={t(
                        'asset_page.sales_rent_action_box.parcel_belongs_to_estate_bid'
                      )}
                      position="top center"
                      on="hover"
                      disabled={!isNFTPartOfAState}
                      trigger={
                        <div className={styles.fullWidth}>
                          <Button
                            as={Link}
                            to={locations.bid(nft.contractAddress, nft.tokenId)}
                            className={classNames({ [styles.bid]: order })}
                            disabled={isNFTPartOfAState}
                            primary={!order}
                            fluid
                          >
                            {t('asset_page.actions.bid')}
                          </Button>
                        </div>
                      }
                    />
                  ) : null}
                </div>
                {order && !hasEnoughManaToBuy ? (
                  <div className={styles.notEnoughMana}>
                    {t('asset_page.sales_rent_action_box.not_enough_mana')}
                  </div>
                ) : null}
              </>
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
        {authorization ? (
          <AuthorizationModal
            open={showAuthorizationModal}
            authorization={authorization}
            onProceed={handleOnRent}
            onCancel={handleCloseAuthorizationModal}
          />
        ) : null}
      </div>
      {isCurrentlyRented && !rentalHasEnded ? (
        <div className={styles.message}>
          <T
            id={'asset_page.sales_rent_action_box.rented_until'}
            values={{
              end_date: (
                <span className={styles.rentedUntil}>
                  {intlFormat(rentalEndTime, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

export default memo(SaleRentActionBox)
