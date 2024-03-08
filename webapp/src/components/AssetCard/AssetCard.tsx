import React, { useCallback, useMemo } from 'react'
import { Item, Network, RentalListing } from '@dcl/schemas'
import { useInView } from 'react-intersection-observer'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'
import { Link } from 'react-router-dom'
import { Card, Icon, useMobileMediaQuery } from 'decentraland-ui'
import { getAssetName, getAssetUrl, isNFT, isCatalogItem } from '../../modules/asset/utils'
import { Asset } from '../../modules/asset/types'
import { NFT } from '../../modules/nft/types'
import { isLand } from '../../modules/nft/utils'
import {
  getMaxPriceOfPeriods,
  getRentalEndDate,
  hasRentalEnded,
  isRentalListingExecuted,
  isRentalListingOpen
} from '../../modules/rental/utils'
import { SortBy } from '../../modules/routing/types'
import { Mana } from '../Mana'
import { AssetImage } from '../AssetImage'
import { FavoritesCounter } from '../FavoritesCounter'
import { ParcelTags } from './ParcelTags'
import { EstateTags } from './EstateTags'
import { WearableTags } from './WearableTags'
import { EmoteTags } from './EmoteTags'
import { ENSTags } from './ENSTags'
import { formatWeiToAssetCard, getCatalogCardInformation } from './utils'
import { Props } from './AssetCard.types'
import './AssetCard.css'

const RentalPrice = ({ asset, rentalPricePerDay }: { asset: Asset; rentalPricePerDay: string }) => {
  return (
    <>
      <Mana className="rental-price" network={asset.network} inline>
        {formatWeiToAssetCard(rentalPricePerDay)}
      </Mana>
      <span className="card-rental-day">/{t('global.day')}</span>
    </>
  )
}

const RentalChip = ({
  asset,
  rental,
  isClaimingBackLandTransactionPending
}: {
  asset: Asset
  isClaimingBackLandTransactionPending: boolean
  rental: RentalListing | null
}) => {
  const rentalEndDate: Date | null = useMemo(() => (rental ? getRentalEndDate(rental) : null), [rental])
  const rentalHasEnded = rental ? hasRentalEnded(rental) : false

  return (
    <div className="LandBubble">
      {isClaimingBackLandTransactionPending ? (
        <>
          <Icon className="warning-icon" name="warning sign" />{' '}
          {t('asset_card.rental_bubble.claiming_back', {
            asset: asset.category
          })}
        </>
      ) : isRentalListingOpen(rental) ? (
        t('asset_card.rental_bubble.listed_for_rent')
      ) : isRentalListingExecuted(rental) && !rentalHasEnded ? (
        t('asset_card.rental_bubble.rented_until', { endDate: rentalEndDate })
      ) : isRentalListingExecuted(rental) && rentalHasEnded ? (
        <>
          <Icon className="warning-icon" name="warning sign" />
          {t('asset_card.rental_bubble.rental_ended')}
        </>
      ) : null}
    </div>
  )
}

const AssetCard = (props: Props) => {
  const {
    asset,
    isManager,
    price,
    showListedTag,
    showRentalChip: showRentalBubble,
    onClick,
    isClaimingBackLandTransactionPending,
    rental,
    sortBy,
    appliedFilters
  } = props

  const { ref, inView } = useInView()
  const isMobile = useMobileMediaQuery()

  const title = getAssetName(asset)
  const { parcel, estate, wearable, emote, ens } = asset.data
  const rentalPricePerDay: string | null = useMemo(() => (isRentalListingOpen(rental) ? getMaxPriceOfPeriods(rental!) : null), [rental])

  const catalogItemInformation = useMemo(() => {
    if (!isNFT(asset) && isCatalogItem(asset)) {
      return getCatalogCardInformation(asset, {
        ...appliedFilters,
        sortBy: sortBy as SortBy
      })
    }
    return null
  }, [appliedFilters, asset, sortBy])

  const renderCatalogItemInformation = useCallback(() => {
    const isAvailableForMint = !isNFT(asset) && asset.isOnSale && asset.available > 0
    const notForSale = !isAvailableForMint && !isNFT(asset) && !asset.minListingPrice

    return catalogItemInformation ? (
      <div className="CatalogItemInformation">
        <span className={`extraInformation ${notForSale ? 'NotForSale' : ''}`}>
          <span>{catalogItemInformation.action}</span>
          {catalogItemInformation.actionIcon && <img src={catalogItemInformation.actionIcon} alt="mint" className="mintIcon" />}
        </span>

        {catalogItemInformation.price ? (
          <div className="PriceInMana">
            <Mana size="large" network={asset.network} className="PriceInMana">
              {catalogItemInformation.price?.includes('-')
                ? `${formatWeiToAssetCard(catalogItemInformation.price.split(' - ')[0])} - ${formatWeiToAssetCard(
                    catalogItemInformation.price.split(' - ')[1]
                  )}`
                : formatWeiToAssetCard(catalogItemInformation.price)}
            </Mana>
          </div>
        ) : (
          `${t('asset_card.owners', {
            count: (asset as Item).owners
          })}`
        )}
        {catalogItemInformation.extraInformation && <span className="extraInformation">{catalogItemInformation.extraInformation}</span>}
      </div>
    ) : null
  }, [asset, catalogItemInformation])

  return (
    <div ref={ref}>
      <Card
        className={`AssetCard ${isCatalogItem(asset) ? 'catalog' : ''}`}
        link
        as={Link}
        to={getAssetUrl(asset, isManager && isLand(asset))}
        onClick={onClick}
        id={`${asset.contractAddress}-${'tokenId' in asset ? asset.tokenId : asset.itemId}`}
      >
        {inView ? (
          <>
            <AssetImage
              className={`AssetImage ${isCatalogItem(asset) ? 'catalog' : 'remove-margin'} ${
                catalogItemInformation?.extraInformation ? 'expandable' : ''
              }`}
              asset={asset}
              showOrderListedTag={showListedTag}
            />
            {!isNFT(asset) && !isMobile ? <FavoritesCounter className="FavoritesCounterBubble" item={asset} /> : null}
            {showRentalBubble ? (
              <RentalChip asset={asset} isClaimingBackLandTransactionPending={isClaimingBackLandTransactionPending} rental={rental} />
            ) : null}
            <Card.Content
              data-testid="asset-card-content"
              className={`${isCatalogItem(asset) ? 'catalog' : ''} ${catalogItemInformation?.extraInformation ? 'expandable' : ''}`}
            >
              <Card.Header>
                <div className={isCatalogItem(asset) ? 'catalogTitle' : 'title'}>
                  <span className={'textOverflow'}>{title}</span>
                  {!isNFT(asset) && isCatalogItem(asset) && asset.network === Network.MATIC && (
                    <span className="creator">
                      <Profile address={asset.creator} textOnly />
                    </span>
                  )}
                </div>
                {!isCatalogItem(asset) && price ? (
                  <Mana network={asset.network} inline>
                    {formatWeiToAssetCard(price)}
                  </Mana>
                ) : rentalPricePerDay ? (
                  <RentalPrice asset={asset} rentalPricePerDay={rentalPricePerDay} />
                ) : null}
              </Card.Header>
              <div className="sub-header">
                {!isCatalogItem(asset) && <Card.Meta className="card-meta">{t(`networks.${asset.network.toLowerCase()}`)}</Card.Meta>}

                {rentalPricePerDay && price ? (
                  <div>
                    <RentalPrice asset={asset} rentalPricePerDay={rentalPricePerDay} />
                  </div>
                ) : null}
              </div>
              {renderCatalogItemInformation()}

              {parcel ? <ParcelTags nft={asset as NFT} /> : null}
              {estate ? <EstateTags nft={asset as NFT} /> : null}
              {wearable ? <WearableTags asset={asset} /> : null}
              {emote ? <EmoteTags asset={asset} /> : null}
              {ens ? <ENSTags nft={asset as NFT} /> : null}
            </Card.Content>
          </>
        ) : null}
      </Card>
    </div>
  )
}

export default React.memo(AssetCard)
