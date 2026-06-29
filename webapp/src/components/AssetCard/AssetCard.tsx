import React, { useCallback, useMemo, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Item, Network, NFTCategory, Rarity, RentalListing } from '@dcl/schemas'
import { Profile } from 'decentraland-dapps/dist/containers'
import { getProfileOfAddress } from 'decentraland-dapps/dist/modules/profile/selectors'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Icon, useMobileMediaQuery } from 'decentraland-ui'
import CreditsIcon from '../../images/icon-credits.svg'
import { Asset, AssetType } from '../../modules/asset/types'
import { getAssetImage, getAssetName, getAssetUrl, isNFT, isCatalogItem } from '../../modules/asset/utils'
import { useIsIAP } from '../../modules/iap/useIAP'
import { NFT } from '../../modules/nft/types'
import { isLand } from '../../modules/nft/utils'
import { RootState } from '../../modules/reducer'
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
import SmartBadge from '../AssetPage/SmartBadge'
import { useCart } from '../Cart'
import { useEmotePreviewPlayer } from '../EmotePreviewPlayer'
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

// Pick black or white text for legibility on top of the rarity color.
function getReadableTextColor(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 150 ? '#16141a' : '#ffffff'
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
  const isIAP = useIsIAP()
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
  const canShowEmotePreview = isEmoteCard && !isMobile && supportsHover && !!emotePreviewPlayer

  const title = getAssetName(asset)
  const { parcel, estate, wearable, emote, ens } = asset.data
  const rarity = wearable?.rarity || emote?.rarity
  const creatorAddress = !isNFT(asset) ? (asset as Item).creator : undefined
  const creatorProfile = useSelector((state: RootState) => (creatorAddress ? getProfileOfAddress(state, creatorAddress) : undefined))
  const isVerifiedCreator = !!creatorProfile?.avatars?.[0]?.hasClaimedName

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

  // Demo shopping cart: add the item instead of navigating to its page.
  const { addItem, isInCart } = useCart()
  const cartId = `${asset.contractAddress}-${'tokenId' in asset ? asset.tokenId : asset.itemId}`
  const inCart = isInCart(cartId)
  const handleAddToCart = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const rawPrice = catalogItemInformation?.price || price || '0'
      const cartPrice = rawPrice.includes('-') ? rawPrice.split(' - ')[0] : rawPrice
      addItem({ id: cartId, name: title, thumbnail: getAssetImage(asset), price: cartPrice, network: asset.network })
    },
    [addItem, cartId, title, asset, catalogItemInformation, price]
  )

  const renderCatalogItemInformation = useCallback(() => {
    const isAvailableForMint = !isNFT(asset) && asset.isOnSale && asset.available > 0
    const notForSale = !isAvailableForMint && !isNFT(asset) && !asset.minListingPrice

    return catalogItemInformation ? (
      <div className="CatalogItemInformation">
        {rarity ? (
          /* Rarity as a colored chip; emote loop/sound chips sit next to it. */
          <div className="AssetCard__chips">
            <span
              className="AssetCard__rarityChip"
              style={{ backgroundColor: Rarity.getColor(rarity), color: getReadableTextColor(Rarity.getColor(rarity)) }}
            >
              {t(`@dapps.rarities.${rarity}`)}
            </span>
            {emote ? <EmoteTags asset={asset} isSocialEmotesEnabled={isSocialEmotesEnabled} /> : null}
            {wearable?.isSmart ? <SmartBadge assetType={isNFT(asset) ? AssetType.NFT : AssetType.ITEM} clickable={false} /> : null}
          </div>
        ) : (
          <span className={`extraInformation ${notForSale ? 'NotForSale' : ''}`}>
            <span>{catalogItemInformation.action}</span>
            {catalogItemInformation.actionIcon && <img src={catalogItemInformation.actionIcon} alt="mint" className="mintIcon" />}
          </span>
        )}

        {catalogItemInformation.price ? (
          isIAP ? (
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
      </div>
    ) : null
  }, [asset, catalogItemInformation, rarity, emote, isSocialEmotesEnabled])

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
            {rarity ? (
              <div className={`AssetCard__addToCart ${inCart ? 'is-added' : ''}`} role="button" onClick={handleAddToCart}>
                <svg className="AssetCard__cartIcon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="22" cy="24" r="2" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
                  <circle cx="13" cy="24" r="2" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
                  <path
                    fill="currentColor"
                    d="M25.658,10l-2.422,9H10.781L8.159,8.515C7.937,7.625,7.137,7,6.219,7H4C3.448,7,3,7.448,3,8c0,0.552,0.448,1,1,1h2.219l2.621,10.485C9.063,20.375,9.863,21,10.781,21h12.455c0.902,0,1.692-0.604,1.93-1.474L27.764,10H25.658z"
                  />
                  <line x1="17" y1="7" x2="17" y2="15" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
                  <line x1="21" y1="11" x2="13" y2="11" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
                </svg>
                <span>{inCart ? 'Added to Cart' : 'Add to Cart'}</span>
              </div>
            ) : null}
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
                      By&nbsp;
                      <Profile address={asset.creator} textOnly />
                      {isVerifiedCreator && <Icon name="check circle" className="verifiedBadge" />}
                    </span>
                  )}
                </div>
                {!isCatalogItem(asset) && price ? (
                  isIAP ? (
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
              {ens ? <ENSTags nft={asset as NFT} /> : null}
            </Card.Content>
          </>
        ) : null}
      </Card>
    </div>
  )
}

export default React.memo(AssetCard)
