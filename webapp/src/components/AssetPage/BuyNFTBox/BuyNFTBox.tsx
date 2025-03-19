import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import formatDistanceToNowI18N from 'date-fns/formatDistanceToNow'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Icon } from 'decentraland-ui'
import clock from '../../../images/clock.png'
import { getExpirationDateLabel } from '../../../lib/date'
import { getIsLegacyOrderExpired, getIsOrderExpired, isLegacyOrder } from '../../../lib/orders'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import BidButton from '../../BidButton'
import PriceComponent from '../PriceComponent'
import { BuyNFTButtons } from '../SaleActionBox/BuyNFTButtons'
import { Props } from './BuyNFTBox.types'
import styles from './BuyNFTBox.module.css'

const BuyNFTBox = ({ nft, bids, address, order, wallet, onFetchBids }: Props) => {
  const [hasFetched, setHasFetched] = useState(false)
  const [useCredits, setUseCredits] = useState(false)
  const alreadyBid = useMemo(() => !!bids.find(({ bidder }) => bidder === address), [bids])
  const isOwner = nft && nft?.owner === address
  const renderHasListing = useCallback(() => {
    if (!nft || !order) return null
    const expiresAtLabel = getExpirationDateLabel(
      isLegacyOrder(order)
        ? wallet && wallet.address === order.owner
          ? order.expiresAt * 1000 // in ms and owner, show when it truly expires
          : order.expiresAt // in ms and NOT owner, show when it was intended to expire
        : order.expiresAt * 1000 // in s
    )
    const isOrderExpired = getIsOrderExpired(order.expiresAt)

    const handleUseCredits = (value: boolean) => {
      setUseCredits(value)
    }

    return (
      <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
        <div className={styles.informationContainer}>
          <div className={styles.columnListing}>
            <span className={styles.informationTitle}>{t('best_buying_option.minting.price').toUpperCase()}</span>
            <PriceComponent price={order.price} network={nft.network} useCredits={useCredits} className={styles.priceComponentContainer} />
          </div>

          <div className={styles.columnListing}>
            <span className={styles.informationTitle}>{t('best_buying_option.buy_listing.issue_number').toUpperCase()}</span>
            <div className={`${styles.containerRow} ${styles.issueNumber}`}>#{order.issuedId}</div>
          </div>
        </div>
        {isOwner ? (
          <>
            {isLegacyOrder(order) ? (
              <div className={styles.expirationMessage}>
                <div className={styles.warningIconContainer}>
                  <Icon name="exclamation triangle" className={styles.warningExpiration} />
                </div>
                <span>
                  {getIsLegacyOrderExpired(order.expiresAt)
                    ? t('asset_page.actions.legacy_order_expired_warning')
                    : t('asset_page.actions.legacy_order_not_expired_warning', {
                        date: formatDistanceToNowI18N(order.expiresAt)
                      })}
                </span>
              </div>
            ) : null}
            {!isLegacyOrder(order) || (isLegacyOrder(order) && !getIsLegacyOrderExpired(order.expiresAt)) ? (
              <Button
                as={Link}
                to={locations.sell(nft.contractAddress, nft.tokenId)}
                fluid
                {...(isLegacyOrder(order) ? { inverted: true } : { primary: true })}
              >
                {isLegacyOrder(order) ? t('asset_page.actions.update_listing') : t('asset_page.actions.update')}
              </Button>
            ) : null}

            {isLegacyOrder(order) ? (
              <Button as={Link} to={locations.cancel(nft.contractAddress, nft.tokenId)} fluid primary>
                {t('asset_page.actions.terminate_listing')}
              </Button>
            ) : (
              <Button as={Link} to={locations.cancel(nft.contractAddress, nft.tokenId)} fluid inverted>
                {t('asset_page.actions.cancel_sale')}
              </Button>
            )}
          </>
        ) : !isOrderExpired ? (
          <BuyNFTButtons
            asset={nft}
            assetType={AssetType.NFT}
            tokenId={nft.tokenId}
            buyWithCardClassName={styles.buyWithCardClassName}
            onUseCredits={handleUseCredits}
          />
        ) : null}
        {!isOwner && <BidButton asset={nft} alreadyBid={alreadyBid} />}
        {!isOrderExpired ? (
          <span className={styles.expiresAt}>
            <img src={clock} alt="clock" className={styles.mintingIcon} />
            &nbsp; {expiresAtLabel}.
          </span>
        ) : null}
      </div>
    )
  }, [nft, order, wallet, isOwner, alreadyBid, useCredits])

  const renderOwnerAndNoListingOptions = useCallback(() => {
    if (!nft) return null
    return (
      <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
        <Button as={Link} to={locations.sell(nft.contractAddress, nft.tokenId)} primary fluid>
          {t('asset_page.actions.sell')}
        </Button>
        {!order ? (
          <Button inverted as={Link} to={locations.transfer(nft.contractAddress, nft.tokenId)} fluid>
            {t('asset_page.actions.transfer')}
          </Button>
        ) : null}
      </div>
    )
  }, [order, nft])

  useEffect(() => {
    if (nft && !hasFetched) {
      setHasFetched(true)
      onFetchBids(nft)
    }
  }, [hasFetched, nft, onFetchBids])

  useEffect(() => {
    setHasFetched(false)
  }, [nft])

  return (
    <div className={styles.BuyNFTBox}>
      {order
        ? renderHasListing()
        : isOwner
          ? renderOwnerAndNoListingOptions()
          : nft && (
              <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
                <div className={styles.informationContainer}>
                  <div className={styles.columnListing}>
                    <span className={styles.informationTitle}>{t('best_buying_option.minting.price').toUpperCase()}</span>
                    <div className={`${styles.containerRow} ${styles.issueNumber}`}>{t('asset_card.not_for_sale')}</div>
                  </div>
                  <div className={styles.columnListing}>
                    <span className={styles.informationTitle}>{t('best_buying_option.buy_listing.issue_number').toUpperCase()}</span>
                    <div className={`${styles.containerRow} ${styles.issueNumber}`}>#{nft.issuedId}</div>
                  </div>
                </div>
                {!isOwner && <BidButton asset={nft} alreadyBid={alreadyBid} />}
              </div>
            )}
    </div>
  )
}

export default React.memo(BuyNFTBox)
