import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Bid,
  BidSortBy,
  ListingStatus,
  Network,
  Order,
  OrderFilters,
  OrderSortBy,
  Rarity
} from '@dcl/schemas'
import { Button, Loader, Mana } from 'decentraland-ui'
import { formatWeiMANA } from '../../../lib/mana'
import { formatDistanceToNow } from '../../../lib/date'
import { locations } from '../../../modules/routing/locations'
import { isNFT } from '../../../modules/asset/utils'
import { bidAPI, orderAPI } from '../../../modules/vendor/decentraland'
import { ManaToFiat } from '../../ManaToFiat'
import { LinkedProfile } from '../../LinkedProfile'
import { BuyNFTButtons } from '../SaleActionBox/BuyNFTButtons'
import { BuyOptions, Props } from './BestBuyingOption.types'
import styles from './BestBuyingOption.module.css'
import { BelowTabs } from '../ListingsTableContainer/ListingsTableContainer.types'
import { useHistory, useLocation } from 'react-router-dom'

const BestBuyingOption = ({ asset, tableRef }: Props) => {
  const [buyOption, setBuyOption] = useState<BuyOptions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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
      search: `selectedTableTab=${BelowTabs.OWNERS}`
    })
    tableRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  useEffect(() => {
    if (asset && !isNFT(asset)) {
      if (asset.available > 1) {
        setBuyOption(BuyOptions.MINT)
      } else {
        setIsLoading(true)

        let params: OrderFilters = {
          contractAddress: asset.contractAddress,
          first: 1,
          skip: 0,
          status: ListingStatus.OPEN
        }
        const sortBy = OrderSortBy.CHEAPEST

        if (asset.network === Network.MATIC && asset.itemId) {
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
                .fetchByNFT(
                  asset.contractAddress,
                  response.data[0].tokenId,
                  ListingStatus.OPEN,
                  BidSortBy.MOST_EXPENSIVE,
                  '1'
                )
                .then(response => {
                  setMostExpensiveBid(response[0])
                })
                .finally(() => setIsLoading(false))
                .catch(error => {
                  console.error(error)
                })
            }
          })
          .finally(() => setIsLoading(false))
          .catch(error => {
            console.error(error)
          })
      }
    }
  }, [asset])

  return (
    <div className={styles.BestBuyingOption}>
      {isLoading ? (
        <div className={styles.containerColumn}>
          <Loader active />
        </div>
      ) : buyOption === BuyOptions.MINT && asset && !isNFT(asset) ? (
        <div className={styles.containerColumn}>
          <span className={styles.cardTitle}>
            {t('best_buying_option.minting.title')}
          </span>
          <div className={styles.informationContainer}>
            <div className={styles.containerColumn}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.minting.price').toUpperCase()}
              </span>
              <div className={styles.containerRow}>
                <div className={styles.informationBold}>
                  <Mana withTooltip size="medium" network={asset.network}>
                    {formatWeiMANA(asset.price)}
                  </Mana>
                </div>
                <div className={styles.informationText}>
                  <ManaToFiat
                    mana={ethers.utils
                      .parseEther(formatWeiMANA(asset.price))
                      .toString()}
                  />
                </div>
              </div>
            </div>
            <div className={styles.containerColumn}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.minting.stock').toUpperCase()}
              </span>
              <span className={styles.informationText}>
                <span className={styles.informationBold}>
                  {asset.available.toLocaleString()}&nbsp;
                </span>
                / {Rarity.getMaxSupply(asset.rarity).toLocaleString()}
              </span>
            </div>
          </div>
          <BuyNFTButtons asset={asset} />
        </div>
      ) : buyOption === BuyOptions.BUY_LISTING && asset && listing ? (
        <div className={styles.containerColumn}>
          <span className={styles.cardTitle}>
            {t('best_buying_option.buy_listing.title')}
          </span>
          <div className={styles.informationContainer}>
            <div className={styles.containerColumn}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.minting.price').toUpperCase()}
              </span>
              <div className={styles.containerRow}>
                <span className={styles.informationBold}>
                  <Mana
                    withTooltip
                    size="medium"
                    network={listing.order.network}
                  >
                    {formatWeiMANA(listing.order.price)}
                  </Mana>
                </span>

                <div className={styles.informationText}>
                  <ManaToFiat
                    mana={ethers.utils
                      .parseEther(formatWeiMANA(listing.order.price))
                      .toString()}
                  />
                </div>
              </div>
            </div>
            {mostExpensiveBid && (
              <div className={styles.containerColumn}>
                <span className={styles.informationTitle}>
                  {t(
                    'best_buying_option.buy_listing.highest_offer'
                  ).toUpperCase()}
                </span>
                <div className={styles.containerRow}>
                  <div className={styles.informationBold}>
                    <Mana
                      withTooltip
                      size="medium"
                      network={listing.order.network}
                    >
                      {formatWeiMANA(mostExpensiveBid.price)}
                    </Mana>
                  </div>

                  <div className={styles.informationText}>
                    <ManaToFiat
                      mana={ethers.utils
                        .parseEther(formatWeiMANA(mostExpensiveBid.price))
                        .toString()}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className={styles.containerColumn}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.buy_listing.issue_number').toUpperCase()}
              </span>
              <span className={styles.informationText}>
                <span className={styles.informationBold}>
                  {listing.order.tokenId}
                </span>
                /{listing.total}
              </span>
            </div>
            <div className={styles.containerColumn}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.buy_listing.owner').toUpperCase()}
              </span>
              <LinkedProfile
                className={styles.linkedProfileRow}
                address={listing.order.owner}
              />
            </div>
          </div>
          <div className={styles.containerRow}>
            <BuyNFTButtons asset={asset} />
          </div>
          <Button
            href={locations.nft(asset.contractAddress, listing.order.tokenId)}
          >
            {t('best_buying_option.buy_listing.view_listing')}
          </Button>
          <span>
            {t('best_buying_option.buy_listing.expires')}&nbsp;
            {formatDistanceToNow(listing.order.expiresAt, {
              addSuffix: true
            })}
            .
          </span>
        </div>
      ) : (
        <div className={styles.containerColumn}>
          <span className={styles.cardTitle}>
            {t('best_buying_option.empty.title')}
          </span>
          <span>
            {t('best_buying_option.empty.you_can')}
            <Button basic onClick={handleViewOffers}>
              {t('best_buying_option.empty.check_the_current_owners')}
            </Button>
            {t('best_buying_option.empty.and_make_an_offer')}
          </span>
        </div>
      )}
    </div>
  )
}

export default React.memo(BestBuyingOption)
