import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link, useLocation } from 'react-router-dom'
import { Item, Network, NFTCategory, RentalListing } from '@dcl/schemas'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Icon, useMobileMediaQuery } from 'decentraland-ui'
import CreditsIcon from '../../images/icon-credits.svg'
import { Asset } from '../../modules/asset/types'
import { getAssetName, getAssetUrl, isNFT, isCatalogItem } from '../../modules/asset/utils'
import { useIsIAP } from '../../modules/iap/useIAP'
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
import { PriceDenomination } from '../../modules/trade/denomination'
import { useTradePriceDenomination } from '../../modules/trade/hooks'
import { AssetImage } from '../AssetImage'
import { FavoritesCounter } from '../FavoritesCounter'
import { useHoverPreview } from '../HoverPreview'
import { Mana } from '../Mana'
import { PeggedManaPrice } from '../PeggedManaPrice'
import { EmoteTags } from './EmoteTags'
import { ENSTags } from './ENSTags'
import { EstateTags } from './EstateTags'
import { ParcelTags } from './ParcelTags'
import { formatWeiToAssetCard, getCatalogCardInformation } from './utils'
import { WearableTags } from './WearableTags'
import { Props } from './AssetCard.types'
import './AssetCard.css'

// A hover has to look deliberate before it costs a 3D load: sweeping the pointer across a row on the
// way somewhere else would otherwise rebuild the preview scene once per card it crosses.
const HOVER_INTENT_MS = 120

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
    priceTradeId,
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
  const isIAP = useIsIAP()
  const isUSDPegged = useTradePriceDenomination(priceTradeId) === PriceDenomination.USD_PEGGED
  const location = useLocation()
  const showListedTag = pageName === PageName.ACCOUNT && Boolean(price) && location.pathname !== locations.root()
  const hoverPreview = useHoverPreview()
  const cardContainerRef = useRef<HTMLDivElement | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  // The element this card handed to the preview, so it can release it without stealing the overlay
  // from whichever card holds it now.
  const previewTargetRef = useRef<HTMLElement | null>(null)
  // Only wearables and emotes have something to render in 3D: the rest of the
  // catalog (land, estates, names) keeps its static image.
  const isPreviewableCard = asset.category === NFTCategory.EMOTE || asset.category === NFTCategory.WEARABLE
  // `useMobileMediaQuery` is viewport-width based, so it returns false on
  // touch laptops/large tablets. Gate the hover preview on pointer
  // capability too — on touch-only devices `mouseenter` fires on tap and
  // would race the click that navigates to the asset detail page.
  const supportsHover = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches, [])
  const canShowHoverPreview = isPreviewableCard && !isMobile && supportsHover && !!hoverPreview

  const title = getAssetName(asset)
  const { parcel, estate, wearable, emote, ens } = asset.data

  const handleHoverPreviewEnter = useCallback(() => {
    if (!hoverPreview || !canShowHoverPreview) return
    clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      const imageEl = cardContainerRef.current?.querySelector<HTMLElement>('.AssetImage')
      if (!imageEl) return
      previewTargetRef.current = imageEl
      hoverPreview.show(imageEl, {
        category: asset.category,
        contractAddress: asset.contractAddress,
        itemId: 'itemId' in asset ? asset.itemId : null,
        tokenId: 'tokenId' in asset ? asset.tokenId : null,
        urn: 'urn' in asset ? (asset.urn ?? null) : null,
        network: asset.network,
        rarity: asset.data.emote?.rarity ?? asset.data.wearable?.rarity,
        bodyShapes: asset.data.wearable?.bodyShapes
      })
    }, HOVER_INTENT_MS)
  }, [hoverPreview, canShowHoverPreview, asset])

  const handleHoverPreviewLeave = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current)
    if (!hoverPreview || !canShowHoverPreview) return
    // A card the pointer merely crossed never asked for the preview, so it has nothing to release —
    // and releasing anyway would take the overlay from the card the pointer has landed on.
    if (previewTargetRef.current) {
      hoverPreview.hide(previewTargetRef.current)
    }
  }, [hoverPreview, canShowHoverPreview])

  // A card can be torn down mid-hover — a filter change, a navigation — without ever firing
  // mouseleave, leaving a pending timer and an overlay tracking a detached node.
  useEffect(
    () => () => {
      clearTimeout(hoverTimeoutRef.current)
      if (previewTargetRef.current) {
        hoverPreview?.hide(previewTargetRef.current)
      }
    },
    [hoverPreview]
  )

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

  /**
   * Whether the figure this card is about to show is the USD-pegged MINT price.
   *
   * The pegged unit belongs to `asset.price` alone: every other figure a catalog card can show — the
   * cheapest listing, a min/max range — comes from resales, which are priced in MANA. So the card can
   * only convert when the value it landed on is the mint price itself; converting a resale figure would
   * be the same mistake in the other direction.
   */
  const showsPeggedMintPrice =
    isUSDPegged && !isNFT(asset) && !!catalogItemInformation?.price && catalogItemInformation.price === asset.price

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
          showsPeggedMintPrice ? (
            <div className="PriceInMana">
              <PeggedManaPrice usdWei={catalogItemInformation.price} network={asset.network} size="large" />
            </div>
          ) : isIAP ? (
            <span className="CreditsPrice">
              <img src={CreditsIcon} alt="Credits" className="creditsIcon" />
              {catalogItemInformation.price?.includes('-')
                ? `${formatWeiToAssetCard(catalogItemInformation.price.split(' - ')[0])} - ${formatWeiToAssetCard(
                    catalogItemInformation.price.split(' - ')[1]
                  )}`
                : formatWeiToAssetCard(catalogItemInformation.price)}
            </span>
          ) : (
            <div className="PriceInMana">
              <Mana size="large" network={asset.network} className="PriceInMana">
                {catalogItemInformation.price?.includes('-')
                  ? `${formatWeiToAssetCard(catalogItemInformation.price.split(' - ')[0])} - ${formatWeiToAssetCard(
                      catalogItemInformation.price.split(' - ')[1]
                    )}`
                  : formatWeiToAssetCard(catalogItemInformation.price)}
              </Mana>
            </div>
          )
        ) : (
          `${t('asset_card.owners', {
            count: (asset as Item).owners
          })}`
        )}
        {catalogItemInformation.extraInformation && <span className="extraInformation">{catalogItemInformation.extraInformation}</span>}
      </div>
    ) : null
  }, [asset, catalogItemInformation, showsPeggedMintPrice, isIAP])

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
      onMouseEnter={canShowHoverPreview ? handleHoverPreviewEnter : undefined}
      onMouseLeave={canShowHoverPreview ? handleHoverPreviewLeave : undefined}
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
                  isUSDPegged ? (
                    <PeggedManaPrice usdWei={price} network={asset.network} inline />
                  ) : isIAP ? (
                    <span className="CreditsPrice">
                      <img src={CreditsIcon} alt="Credits" className="creditsIcon" />
                      {formatWeiToAssetCard(price)}
                    </span>
                  ) : (
                    <Mana network={asset.network} inline>
                      {formatWeiToAssetCard(price)}
                    </Mana>
                  )
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
