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
import { useEmotePreviewPlayer } from '../EmotePreviewPlayer'
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
  const emotePreviewPlayer = useEmotePreviewPlayer()
  const cardContainerRef = useRef<HTMLDivElement | null>(null)
  const isEmoteCard = asset.category === NFTCategory.EMOTE
  // `useMobileMediaQuery` is viewport-width based, so it returns false on
  // touch laptops/large tablets. Gate the hover preview on pointer
  // capability too — on touch-only devices `mouseenter` fires on tap and
  // would race the click that navigates to the asset detail page.
  const supportsHover = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches, [])
  const canShowEmotePreview = isEmoteCard && !isMobile && supportsHover

  const title = getAssetName(asset)
  const { parcel, estate, wearable, emote, ens } = asset.data

  const handleEmoteHoverEnter = useCallback(() => {
    if (!emotePreviewPlayer || !canShowEmotePreview) return
    const container = cardContainerRef.current
    if (!container) return
    const imageEl = container.querySelector<HTMLElement>('.AssetImage')
    if (!imageEl) return
    emotePreviewPlayer.show(imageEl, {
      contractAddress: asset.contractAddress,
      itemId: 'itemId' in asset ? asset.itemId : null,
      tokenId: 'tokenId' in asset ? asset.tokenId : null,
      urn: 'urn' in asset ? asset.urn ?? null : null,
      network: asset.network,
      rarity: asset.data.emote?.rarity
    })
  }, [emotePreviewPlayer, canShowEmotePreview, asset])

  const handleEmoteHoverLeave = useCallback(() => {
    if (!emotePreviewPlayer || !canShowEmotePreview) return
    emotePreviewPlayer.hide()
  }, [emotePreviewPlayer, canShowEmotePreview])
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

  const setWrapperRef = useCallback(
    (node: HTMLDivElement | null) => {
      cardContainerRef.current = node
      ref(node)
    },
    [ref]
  )

  return (
    <div
      ref={setWrapperRef}
      onMouseEnter={canShowEmotePreview ? handleEmoteHoverEnter : undefined}
      onMouseLeave={canShowEmotePreview ? handleEmoteHoverLeave : undefined}
    >
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
