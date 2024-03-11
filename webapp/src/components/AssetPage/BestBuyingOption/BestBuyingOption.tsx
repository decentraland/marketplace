import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Bid, BidSortBy, ListingStatus, Network, Order, OrderFilters, OrderSortBy, Rarity } from '@dcl/schemas'
import { Button, Popup } from 'decentraland-ui'
import { getExpirationDateLabel } from '../../../lib/date'
import { locations } from '../../../modules/routing/locations'
import { isNFT } from '../../../modules/asset/utils'
import { bidAPI, orderAPI } from '../../../modules/vendor/decentraland'
import { AssetType } from '../../../modules/asset/types'
import mintingIcon from '../../../images/minting.png'
import infoIcon from '../../../images/infoIcon.png'
import clock from '../../../images/clock.png'
import noListings from '../../../images/noListings.png'
import { getIsOrderExpired, isLegacyOrder } from '../../../lib/orders'
import Mana from '../../Mana/Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import { BuyNFTButtons } from '../SaleActionBox/BuyNFTButtons'
import { ItemSaleActions } from '../SaleActionBox/ItemSaleActions'
import { BuyOptions, Props } from './BestBuyingOption.types'
import styles from './BestBuyingOption.module.css'

const BestBuyingOption = ({ asset, tableRef }: Props) => {
  const [buyOption, setBuyOption] = useState<BuyOptions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [listing, setListing] = useState<{
    order: Order
    total: number
  } | null>(null)
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

        if (asset.network === Network.MATIC) {
          params.itemId = asset.itemId
        } else if (asset.network === Network.ETHEREUM) {
          params.nftName = asset.name
        }

        orderAPI
          .fetchOrders(params, sortBy)
          .then(response => {
            if (response.data.length > 0) {
              setBuyOption(BuyOptions.BUY_LISTING)
              setListing({ order: response.data[0], total: response.total })
              bidAPI
                .fetchByNFT(asset.contractAddress, response.data[0].tokenId, ListingStatus.OPEN, BidSortBy.MOST_EXPENSIVE, '1')
                .then(response => {
                  setIsLoading(false)
                  setMostExpensiveBid(response.data[0])
                })
                .catch(error => {
                  console.error(error)
                  setIsLoading(false)
                })
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
          <span className={styles.cardTitle}>
            {t('best_buying_option.minting.title')}&nbsp;
            <img src={mintingIcon} alt="mint" className={styles.mintingIcon} />
            &nbsp;
            <Popup
              content={t('best_buying_option.minting.minting_popup')}
              position="top center"
              trigger={<img src={infoIcon} alt="info" className={styles.informationTooltip} />}
              on="hover"
            />
          </span>
          <div className={styles.mintingContainer}>
            <div className={styles.mintingStockContainer}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.minting.price').toUpperCase()}&nbsp;
                <Popup
                  content={
                    asset.network === Network.MATIC
                      ? t('best_buying_option.minting.polygon_mana')
                      : t('best_buying_option.minting.ethereum_mana')
                  }
                  position="top center"
                  trigger={<img src={infoIcon} alt="info" className={styles.informationTooltip} />}
                  on="hover"
                />
              </span>
              <div className={styles.containerRow}>
                <div className={styles.informationBold}>
                  <Mana withTooltip size="large" network={asset.network} className={styles.informationBold}>
                    {formatWeiToAssetCard(asset.price)}
                  </Mana>
                </div>
                {+asset.price > 0 && (
                  <div className={styles.informationText}>
                    {'('}
                    <ManaToFiat mana={asset.price} />
                    {')'}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.mintingStockContainer}>
              <span className={styles.informationTitle}>{t('best_buying_option.minting.stock').toUpperCase()}</span>
              <span className={styles.stockText}>
                {asset.available.toLocaleString()}/ {Rarity.getMaxSupply(asset.rarity).toLocaleString()}
              </span>
            </div>
          </div>
          <ItemSaleActions item={asset} customClassnames={customClasses} />
        </div>
      ) : buyOption === BuyOptions.BUY_LISTING && asset && listing && !getIsOrderExpired(listing.order.expiresAt) ? (
        <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
          <span className={styles.cardTitle}>
            {t('best_buying_option.buy_listing.title')}: &nbsp;
            {t('best_buying_option.buy_listing.issue_number')}&nbsp; #{listing.order.issuedId}
          </span>
          <div className={styles.informationContainer}>
            <div className={styles.columnListing}>
              <span className={styles.informationTitle}>{t('best_buying_option.minting.price').toUpperCase()}</span>
              <div className={`${styles.containerRow} ${styles.centerItems}`}>
                <div className={styles.informationBold}>
                  <Mana withTooltip size="large" network={asset.network} className={styles.informationBold}>
                    {formatWeiToAssetCard(listing.order.price)}
                  </Mana>
                </div>
                {+listing.order.price > 0 && (
                  <div className={styles.informationText}>
                    {'('}
                    <ManaToFiat mana={listing.order.price} />
                    {')'}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.columnListing}>
              <span className={styles.informationTitle}>{t('best_buying_option.buy_listing.highest_offer').toUpperCase()}</span>
              <div className={`${styles.containerRow} ${styles.centerItems}`}>
                {mostExpensiveBid ? (
                  <>
                    <div className={styles.listingMana}>
                      <Mana withTooltip size="small" network={listing.order.network} className={styles.listingMana}>
                        {formatWeiToAssetCard(mostExpensiveBid.price)}
                      </Mana>
                    </div>

                    <div className={styles.informationListingText}>
                      {'('}
                      <ManaToFiat mana={mostExpensiveBid.price} />
                      {')'}
                    </div>
                  </>
                ) : (
                  <span className={styles.noOffer}>{t('best_buying_option.buy_listing.no_offer')}</span>
                )}
              </div>
            </div>
          </div>
          <BuyNFTButtons
            asset={asset}
            assetType={AssetType.NFT}
            tokenId={listing.order.tokenId}
            buyWithCardClassName={styles.buyWithCardClassName}
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
