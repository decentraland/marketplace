import React, { useCallback, useMemo, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link, useLocation } from 'react-router-dom'
import { Item, Network, NFTCategory, RentalListing } from '@dcl/schemas'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Icon, useMobileMediaQuery } from 'decentraland-ui'
import { Asset } from '../../modules/asset/types'
import { getAssetName, getAssetUrl, isNFT, isCatalogItem } from '../../modules/asset/utils'
import { NFT } from '../../modules/nft/types'
import { isLand } from '../../modules/nft/utils'
import {
  getMaxPriceOfPeriods,
  getRentalEndDate,
  hasRentalEnded,
  isRentalListingExecuted,
  isRentalListingOpen
} from '../../modules/rental/utils'
import { locations } from '../../modules/routing/locations'
import { PageName, SortBy } from '../../modules/routing/types'
import { AssetImage } from '../AssetImage'
import { useEmoteHoverPreviewOptional } from '../EmoteHoverPreview'
import { FavoritesCounter } from '../FavoritesCounter'
import { Mana } from '../Mana'
import { EmoteTags } from './EmoteTags'
import { ENSTags } from './ENSTags'
import { EstateTags } from './EstateTags'
import { ParcelTags } from './ParcelTags'
import { formatWeiToAssetCard, getCatalogCardInformation } from './utils'
import { WearableTags } from './WearableTags'
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
    pageName,
    showRentalChip: showRentalBubble,
    onClick,
    isClaimingBackLandTransactionPending,
    rental,
    sortBy,
    appliedFilters,
    isSocialEmotesEnabled
  } = props

  const { ref, inView } = useInView()
  const isMobile = useMobileMediaQuery()
  const location = useLocation()
  const showListedTag = pageName === PageName.ACCOUNT && Boolean(price) && location.pathname !== locations.root()

  // Emote hover preview
  const emoteHoverPreview = useEmoteHoverPreviewOptional()
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const isEmote = asset.category === NFTCategory.EMOTE

  const handleMouseEnter = useCallback(() => {
    if (!isMobile && isEmote && emoteHoverPreview && imageWrapperRef.current) {
      const rect = imageWrapperRef.current.getBoundingClientRect()
      emoteHoverPreview.showPreview(asset, rect)
    }
  }, [isMobile, isEmote, emoteHoverPreview, asset])

  // Check if this asset is being previewed (to force hover state)
  const isBeingPreviewed = useMemo(() => {
    if (!emoteHoverPreview) return false
    const itemId = isNFT(asset) ? undefined : asset.itemId
    const tokenId = isNFT(asset) ? asset.tokenId : undefined
    return emoteHoverPreview.isAssetBeingPreviewed(asset.contractAddress, itemId, tokenId)
  }, [emoteHoverPreview, asset])

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (!emoteHoverPreview) return

      // Check if mouse moved to the emote preview portal
      const relatedTarget = e.relatedTarget as HTMLElement | null
      if (relatedTarget) {
        // Check if the relatedTarget is within the emote preview portal
        const previewPortal = document.getElementById('emote-hover-preview-portal')
        if (previewPortal && previewPortal.contains(relatedTarget)) {
          console.log('[AssetCard] Mouse moved to preview portal, not hiding')
          return
        }
      }

      // Check if this asset is currently being previewed
      // Don't call hidePreview if so - the mouse likely moved to the preview portal
      const itemId = isNFT(asset) ? undefined : asset.itemId
      const tokenId = isNFT(asset) ? asset.tokenId : undefined
      const currentlyPreviewed = emoteHoverPreview.isAssetBeingPreviewed(asset.contractAddress, itemId, tokenId)

      console.log('[AssetCard] handleMouseLeave - currentlyPreviewed:', currentlyPreviewed, 'relatedTarget:', relatedTarget?.className)

      if (!currentlyPreviewed) {
        emoteHoverPreview.hidePreview()
      }
    },
    [emoteHoverPreview, asset]
  )

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

  const cardClassName = useMemo(() => {
    const classes = ['AssetCard']
    if (isCatalogItem(asset)) classes.push('catalog')
    if (isBeingPreviewed) classes.push('emote-preview-active')
    return classes.join(' ')
  }, [asset, isBeingPreviewed])

  return (
    <div ref={ref}>
      <Card
        className={cardClassName}
        link
        as={Link}
        to={getAssetUrl(asset, isManager && isLand(asset))}
        onClick={onClick}
        id={`${asset.contractAddress}-${'tokenId' in asset ? asset.tokenId : asset.itemId}`}
      >
        {inView ? (
          <>
            <div ref={imageWrapperRef} className="AssetCard__imageWrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <AssetImage
                className={`AssetImage ${isCatalogItem(asset) ? 'catalog' : 'remove-margin'} ${
                  catalogItemInformation?.extraInformation ? 'expandable' : ''
                }`}
                asset={asset}
                showOrderListedTag={showListedTag}
              />
            </div>
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
              {emote ? <EmoteTags asset={asset} isSocialEmotesEnabled={isSocialEmotesEnabled} /> : null}
              {ens ? <ENSTags nft={asset as NFT} /> : null}
            </Card.Content>
          </>
        ) : null}
      </Card>
    </div>
  )
}

export default React.memo(AssetCard)
