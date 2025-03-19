import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Bid, BidSortBy, ListingStatus, Order, OrderFilters, OrderSortBy, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Popup } from 'decentraland-ui'
import clock from '../../../images/clock.png'
import infoIcon from '../../../images/infoIcon.png'
import mintingIcon from '../../../images/minting.png'
import noListings from '../../../images/noListings.png'
import { getExpirationDateLabel } from '../../../lib/date'
import { getIsOrderExpired, isLegacyOrder } from '../../../lib/orders'
import { AssetType } from '../../../modules/asset/types'
import { isNFT } from '../../../modules/asset/utils'
import { Item } from '../../../modules/item/types'
import { locations } from '../../../modules/routing/locations'
import { bidAPI as legacyBidAPI, orderAPI as legacyOrderAPI, marketplaceOrderAPI } from '../../../modules/vendor/decentraland'
import { marketplaceAPI } from '../../../modules/vendor/decentraland/marketplace/api'
import PriceComponent from '../PriceComponent'
import { BuyNFTButtons } from '../SaleActionBox/BuyNFTButtons'
import { ItemSaleActions } from '../SaleActionBox/ItemSaleActions'
import { BuyOptions, Props } from './BestBuyingOption.types'
import styles from './BestBuyingOption.module.css'

const BestBuyingOption = ({ asset, tableRef, isOffchainPublicNFTOrdersEnabled }: Props) => {
  const [buyOption, setBuyOption] = useState<BuyOptions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [useCredits, setUseCredits] = useState(false)
  const [listing, setListing] = useState<{
    order: Order
    total: number
  } | null>(null)

  const handleUseCredits = (value: boolean) => {
    setUseCredits(value)
  }

  const [mostExpensiveBid, setMostExpensiveBid] = useState<Bid | null>(null)
  const history = useHistory()
  const location = useLocation()

  const handleViewOffers = () => {
    history.replace({
      pathname: location.pathname,
      search: `selectedTableTab=owners`
    })
    tableRef && tableRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  useEffect(() => {
    if (asset && !isNFT(asset)) {
      if (asset.available > 0 && asset.isOnSale) {
        setBuyOption(BuyOptions.MINT)
        setIsLoading(false)
      } else if (!listing) {
        const params: OrderFilters = {
          contractAddress: asset.contractAddress,
          first: 1,
          skip: 0,
          status: ListingStatus.OPEN
        }
        const sortBy = OrderSortBy.CHEAPEST

        params.itemId = asset.itemId

        const orderAPI = isOffchainPublicNFTOrdersEnabled ? marketplaceOrderAPI : legacyOrderAPI
        orderAPI
          .fetchOrders(params, sortBy)
          .then(response => {
            if (response.data.length > 0) {
              setBuyOption(BuyOptions.BUY_LISTING)
              setListing({ order: response.data[0], total: response.total })
              if (isOffchainPublicNFTOrdersEnabled) {
                marketplaceAPI
                  .fetchBids({
                    contractAddress: asset.contractAddress,
                    tokenId: response.data[0].tokenId,
                    status: ListingStatus.OPEN,
                    sortBy: BidSortBy.MOST_EXPENSIVE,
                    limit: 1
                  })
                  .then(({ results }) => {
                    setIsLoading(false)
                    setMostExpensiveBid(results[0])
                  })
                  .catch(error => {
                    console.error(error)
                  })
              } else {
                legacyBidAPI
                  .fetchByNFT(asset.contractAddress, response.data[0].tokenId, ListingStatus.OPEN, BidSortBy.MOST_EXPENSIVE, '1')
                  .then(response => {
                    setIsLoading(false)
                    setMostExpensiveBid(response.data[0])
                  })
                  .catch(error => {
                    console.error(error)
                    setIsLoading(false)
                  })
              }
            } else {
              setIsLoading(false)
            }
          })
          .catch(error => {
            console.error(error)
            setIsLoading(false)
          })
      }
    }
  }, [asset, listing])

  const customClasses = {
    primaryButton: styles.primaryButton,
    secondaryButton: styles.buyWithCardClassName,
    outlinedButton: styles.outlinedButton,
    buyWithCardClassName: styles.buyWithCardClassName
  }

  const renderPrice = useCallback(() => {
    if (!asset) return null
    if (listing && buyOption === BuyOptions.BUY_LISTING) {
      return <PriceComponent price={listing.order.price} network={listing.order.network} useCredits={useCredits} />
    }

    const item: Item = asset as Item

    return <PriceComponent price={item.price} network={item.network} useCredits={useCredits} />
  }, [asset, listing, useCredits, buyOption])

  return isLoading ? null : (
    <div
      data-testid="best-buying-option-container"
      className={
        buyOption === BuyOptions.MINT || buyOption === BuyOptions.BUY_LISTING
          ? `${styles.BestBuyingOption} ${styles.AlignEnd}`
          : styles.BestBuyingOption
      }
    >
      {buyOption === BuyOptions.MINT && asset && !isNFT(asset) ? (
        <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
          <div className={styles.buyDirectly}>
            <img src={mintingIcon} alt="mint" width="20" height="20" />
            {t('best_buying_option.minting.title')}
            &nbsp;
            <Popup
              content={t('best_buying_option.minting.minting_popup')}
              position="top center"
              trigger={<img src={infoIcon} alt="info" className={styles.informationTooltip} />}
              on="hover"
            />
          </div>
          <div className={styles.mainContainer}>
            <div className={styles.priceStockLabels}>
              <span className={styles.label}>{t('best_buying_option.minting.price')}</span>
              <span className={styles.label}>{t('best_buying_option.minting.stock')}</span>
            </div>
            <div className={styles.priceRow}>
              {renderPrice()}
              <div className={styles.stockContainer}>
                {asset.available.toLocaleString()}/{Rarity.getMaxSupply(asset.rarity).toLocaleString()}
              </div>
            </div>
            <div className={styles.buyNFTButtons}>
              <ItemSaleActions item={asset} customClassnames={customClasses} onUseCredits={handleUseCredits} />
            </div>
          </div>
        </div>
      ) : buyOption === BuyOptions.BUY_LISTING && asset && listing && !getIsOrderExpired(listing.order.expiresAt) ? (
        <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
          <span className={styles.cardTitle}>
            {t('best_buying_option.buy_listing.title')}: &nbsp;
            {t('best_buying_option.buy_listing.issue_number')}&nbsp; #{listing.order.issuedId}
          </span>
          <div className={styles.mainContainer}>
            <div className={styles.priceStockLabels}>
              <span className={styles.label}>{t('best_buying_option.minting.price').toUpperCase()}</span>
              <span className={styles.label}>{t('best_buying_option.buy_listing.highest_offer').toUpperCase()}</span>
            </div>
            <div className={styles.priceRow}>
              {renderPrice()}
              <div className={styles.columnListing}>
                {mostExpensiveBid ? (
                  <PriceComponent price={mostExpensiveBid.price} network={listing.order.network} useCredits={useCredits} />
                ) : (
                  <span className={styles.noOffer}>{t('best_buying_option.buy_listing.no_offer')}</span>
                )}
              </div>
            </div>
            <div className={styles.buyNFTButtons}>
              <BuyNFTButtons
                asset={asset}
                assetType={AssetType.NFT}
                tokenId={listing.order.tokenId}
                buyWithCardClassName={styles.buyWithCardClassName}
                onUseCredits={handleUseCredits}
              />
              <Button as={Link} to={locations.nft(asset.contractAddress, listing.order.tokenId)} inverted>
                {t('best_buying_option.buy_listing.view_listing')}
              </Button>
              <span className={styles.expiresAt}>
                <img src={clock} alt="clock" className={styles.mintingIcon} />
                &nbsp;
                {getExpirationDateLabel(listing.order.expiresAt * (isLegacyOrder(listing.order) ? 1 : 1000))}.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyCardContainer}>
          <img src={noListings} alt={t('best_buying_option.empty.title')} className={styles.nolistingsImage} />
          <div className={styles.containerColumn}>
            <span className={styles.emptyCardTitle}>{t('best_buying_option.empty.title')}</span>
            <span>
              {t('best_buying_option.empty.you_can')}
              <span onClick={handleViewOffers} className={styles.checkTheOwners}>
                {t('best_buying_option.empty.check_the_current_owners')}
              </span>

              {t('best_buying_option.empty.and_make_an_offer')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(BestBuyingOption)
