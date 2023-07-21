import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import formatDistanceToNowI18N from 'date-fns/formatDistanceToNow'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ListingStatus, Order, OrderFilters, OrderSortBy } from '@dcl/schemas'
import { Button, Icon, Loader } from 'decentraland-ui'
import Mana from '../../Mana/Mana'
import { getExpirationDateLabel } from '../../../lib/date'
import clock from '../../../images/clock.png'
import makeOffer from '../../../images/makeOffer.png'
import { locations } from '../../../modules/routing/locations'
import { bidAPI, orderAPI } from '../../../modules/vendor/decentraland'
import { AssetType } from '../../../modules/asset/types'
import { getIsOrderExpired, isLegacyOrder } from '../../../lib/orders'
import { ManaToFiat } from '../../ManaToFiat'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import { BuyNFTButtons } from '../SaleActionBox/BuyNFTButtons'
import { Props } from './BuyNFTBox.types'
import styles from './BuyNFTBox.module.css'

const FIRST = '1'

const BuyNFTBox = ({ nft, address }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [listing, setListing] = useState<{
    order: Order
    total: number
  } | null>(null)

  const [canBid, setCanBid] = useState(false)
  const isOwner = nft && nft?.owner === address

  useEffect(() => {
    let cancel = false
    if (!isOwner && nft) {
      bidAPI
        .fetchByNFT(
          nft.contractAddress,
          nft.tokenId,
          null,
          undefined,
          FIRST,
          undefined,
          address
        )
        .then(response => {
          if (response.total === 0 && !cancel) setCanBid(true)
        })
        .catch(error => {
          console.error(error)
        })
    }
    return () => {
      cancel = true
    }
  }, [nft, address, isOwner])

  useEffect(() => {
    let cancel = false
    if (nft) {
      setIsLoading(true)

      let params: OrderFilters = {
        contractAddress: nft.contractAddress,
        first: 1,
        skip: 0,
        tokenId: nft.tokenId,
        status: ListingStatus.OPEN
      }

      orderAPI
        .fetchOrders(params, OrderSortBy.CHEAPEST)
        .then(response => {
          if (!cancel && response.data.length > 0) {
            setListing({ order: response.data[0], total: response.total })
          }
        })
        .finally(() => !cancel && setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
    return () => {
      cancel = true
    }
  }, [nft])

  const renderLoading = useCallback(
    () => (
      <div className={styles.emptyContainer}>
        <Loader active data-testid="loader" />
      </div>
    ),
    []
  )

  const renderHasListing = useCallback(() => {
    if (!nft || !listing) return null
    const expiresAtLabel = getExpirationDateLabel(
      listing.order.expiresAt * (isLegacyOrder(listing.order) ? 1 : 1000)
    )
    const isOrderExpired = getIsOrderExpired(listing.order.expiresAt)

    return (
      <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
        {!isOrderExpired || (isLegacyOrder(listing.order) && isOwner) ? (
          <div className={styles.informationContainer}>
            <div className={styles.columnListing}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.minting.price').toUpperCase()}
              </span>
              <div className={`${styles.containerRow} ${styles.centerItems}`}>
                <div className={styles.informationBold}>
                  <Mana
                    withTooltip
                    size="large"
                    network={nft.network}
                    className={styles.informationBold}
                  >
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
              <span className={styles.informationTitle}>
                {t('best_buying_option.buy_listing.issue_number').toUpperCase()}
              </span>
              <div className={`${styles.containerRow} ${styles.issueNumber}`}>
                #{listing.order.issuedId}
              </div>
            </div>
          </div>
        ) : null}
        {isOwner ? (
          <>
            {isLegacyOrder(listing.order) ? (
              <div className={styles.expirationMessage}>
                <div className={styles.warningIconContainer}>
                  <Icon
                    name="exclamation triangle"
                    className={styles.warningExpiration}
                  />
                </div>
              </div>
            ) : null}
            {!isOrderExpired ? (
              <Button
                as={Link}
                to={locations.sell(nft.contractAddress, nft.tokenId)}
                primary
                fluid
              >
                {t('asset_page.actions.update')}
              </Button>
            ) : null}

            <Button
              as={Link}
              to={locations.cancel(nft.contractAddress, nft.tokenId)}
              fluid
              inverted
            >
              {t('asset_page.actions.cancel_sale')}
            </Button>
          </>
        ) : !isOrderExpired ? (
          <BuyNFTButtons
            assetType={AssetType.NFT}
            contractAddress={nft.contractAddress}
            network={nft.network}
            tokenId={nft.tokenId}
            buyWithCardClassName={styles.buyWithCardClassName}
          />
        ) : null}
        {canBid && !isOwner && (
          <Button
            inverted
            className={styles.makeOfferButton}
            as={Link}
            to={locations.bid(nft.contractAddress, nft.tokenId)}
          >
            <img
              src={makeOffer}
              alt={t('best_buying_option.buy_listing.make_offer')}
            />
            &nbsp;
            {t('best_buying_option.buy_listing.make_offer')}
          </Button>
        )}
        {!isOrderExpired ? (
          <span className={styles.expiresAt}>
            <img src={clock} alt="clock" className={styles.mintingIcon} />
            &nbsp; {expiresAtLabel}.
          </span>
        ) : null}
      </div>
    )
  }, [canBid, isOwner, listing, nft])

  const renderOwnerAndNoListingOptions = useCallback(() => {
    if (!nft) return null
    return (
      <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
        <Button
          as={Link}
          to={locations.sell(nft.contractAddress, nft.tokenId)}
          primary
          fluid
        >
          {t('asset_page.actions.sell')}
        </Button>
        {!listing ? (
          <Button
            inverted
            as={Link}
            to={locations.transfer(nft.contractAddress, nft.tokenId)}
            fluid
          >
            {t('asset_page.actions.transfer')}
          </Button>
        ) : null}
      </div>
    )
  }, [listing, nft])

  return (
    <div className={styles.BuyNFTBox}>
      {isLoading
        ? renderLoading()
        : !!listing
        ? renderHasListing()
        : isOwner
        ? renderOwnerAndNoListingOptions()
        : nft && (
            <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
              <div className={styles.informationContainer}>
                <div className={styles.columnListing}>
                  <span className={styles.informationTitle}>
                    {t('best_buying_option.minting.price').toUpperCase()}
                  </span>
                  <div
                    className={`${styles.containerRow} ${styles.issueNumber}`}
                  >
                    {t('asset_card.not_for_sale')}
                  </div>
                </div>
                <div className={styles.columnListing}>
                  <span className={styles.informationTitle}>
                    {t(
                      'best_buying_option.buy_listing.issue_number'
                    ).toUpperCase()}
                  </span>
                  <div
                    className={`${styles.containerRow} ${styles.issueNumber}`}
                  >
                    #{nft.issuedId}
                  </div>
                </div>
              </div>
              {!isOwner && canBid && (
                <Button
                  inverted
                  className={styles.makeOfferButton}
                  as={Link}
                  to={locations.bid(nft.contractAddress, nft.tokenId)}
                >
                  <img
                    src={makeOffer}
                    alt={t('best_buying_option.buy_listing.make_offer')}
                  />
                  &nbsp;
                  {t('best_buying_option.buy_listing.make_offer')}
                </Button>
              )}
            </div>
          )}
    </div>
  )
}

export default React.memo(BuyNFTBox)
