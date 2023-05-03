import React, { useMemo } from 'react'
import { RentalListing } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'
import { Link } from 'react-router-dom'
import { Card, Icon } from 'decentraland-ui'
import {
  getAssetName,
  getAssetUrl,
  isNFT,
  isCatalogItem
} from '../../modules/asset/utils'
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
import mintingIcon from '../../images/minting.png'
import { Mana } from '../Mana'
import { AssetImage } from '../AssetImage'
import { FavoritesCounter } from '../FavoritesCounter'
import { ParcelTags } from './ParcelTags'
import { EstateTags } from './EstateTags'
import { WearableTags } from './WearableTags'
import { EmoteTags } from './EmoteTags'
import { ENSTags } from './ENSTags'
import { fomrmatWeiToAssetCard } from './utils'
import { Props } from './AssetCard.types'
import './AssetCard.css'

const MINT = 'MINT'
const LISTING = 'LISTING'

const RentalPrice = ({
  asset,
  rentalPricePerDay
}: {
  asset: Asset
  rentalPricePerDay: string
}) => {
  return (
    <>
      <Mana className="rental-price" network={asset.network} inline>
        {fomrmatWeiToAssetCard(rentalPricePerDay)}
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
  const rentalEndDate: Date | null = useMemo(
    () => (rental ? getRentalEndDate(rental) : null),
    [rental]
  )
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
    isFavoritesEnabled,
    sortBy
  } = props

  const title = getAssetName(asset)
  const { parcel, estate, wearable, emote, ens } = asset.data
  const rentalPricePerDay: string | null = useMemo(
    () => (isRentalListingOpen(rental) ? getMaxPriceOfPeriods(rental!) : null),
    [rental]
  )

  const catalogItemInformation = () => {
    let information: {
      action: string
      actionIcon: string | null
      price: string | null
      extraInformation: React.ReactNode | null
    } | null = null
    if (!isNFT(asset) && isCatalogItem(asset)) {
      const isAvailableForMint = asset.isOnSale && asset.available > 0

      if (!isAvailableForMint && !asset.minListingPrice) {
        information = {
          action: t('asset_card.not_for_sale'),
          actionIcon: null,
          price: null,
          extraInformation: `${t('asset_card.owners', {
            count: asset.owners
          })}`
        }
      } else {
        const mostExpensive =
          asset.maxListingPrice && asset.price < asset.maxListingPrice
            ? LISTING
            : isAvailableForMint
            ? MINT
            : null
        const cheapest =
          asset.minListingPrice && asset.price > asset.minListingPrice
            ? LISTING
            : isAvailableForMint
            ? MINT
            : null

        const displayExtraInfomationToMint =
          isAvailableForMint &&
          ((sortBy === SortBy.MOST_EXPENSIVE && mostExpensive === LISTING) ||
            (sortBy === SortBy.CHEAPEST && cheapest === LISTING))

        information = {
          action:
            sortBy === SortBy.CHEAPEST
              ? t('asset_card.cheapest_option')
              : sortBy === SortBy.MOST_EXPENSIVE
              ? t('asset_card.most_expensive')
              : isAvailableForMint
              ? t('asset_card.available_for_mint')
              : t('asset_card.cheapest_listing'),
          actionIcon: isAvailableForMint ? mintingIcon : null,
          price:
            sortBy === SortBy.MOST_EXPENSIVE
              ? mostExpensive === MINT
                ? asset.price
                : asset.maxListingPrice ?? null
              : asset.minPrice ?? null,
          extraInformation:
            asset.maxListingPrice && asset.minListingPrice && asset.listings ? (
              <span>
                {displayExtraInfomationToMint
                  ? t('asset_card.also_minting')
                  : t('asset_card.listings', { count: asset.listings })}
                :&nbsp;
                <Mana size="small" network={asset.network} className="tiniMana">
                  {fomrmatWeiToAssetCard(
                    displayExtraInfomationToMint
                      ? asset.price
                      : asset.minListingPrice
                  )}
                </Mana>
                &nbsp;
                {asset.listings > 1 &&
                  !displayExtraInfomationToMint &&
                  asset.minListingPrice !== asset.maxListingPrice &&
                  `- ${fomrmatWeiToAssetCard(asset.maxListingPrice)}`}
              </span>
            ) : null
        }
      }
    }
    return information ? (
      <div className="CatalogItemInformation">
        <span>
          {information.action} &nbsp;
          {information.actionIcon && (
            <img src={information.actionIcon} alt="mint" className="mintIcon" />
          )}
        </span>

        {information.price && (
          <div className="PriceInMana">
            <Mana size="large" network={asset.network} className="PriceInMana">
              {fomrmatWeiToAssetCard(information.price)}
            </Mana>
          </div>
        )}
        {information.extraInformation && (
          <span className="extraInformation">
            {information.extraInformation}
          </span>
        )}
      </div>
    ) : null
  }

  return (
    <Card
      className={`AssetCard ${isCatalogItem(asset) ? 'catalog' : ''}`}
      link
      as={Link}
      to={getAssetUrl(asset, isManager && isLand(asset))}
      onClick={onClick}
      id={`${asset.contractAddress}-${
        'tokenId' in asset ? asset.tokenId : asset.itemId
      }`}
    >
      <AssetImage
        className={`AssetImage ${isCatalogItem(asset) ? 'catalog' : ''}`}
        asset={asset}
        showOrderListedTag={showListedTag}
        showMonospace
      />
      {isFavoritesEnabled && !isNFT(asset) ? (
        <FavoritesCounter className="FavoritesCounterBubble" item={asset} />
      ) : null}
      {showRentalBubble ? (
        <RentalChip
          asset={asset}
          isClaimingBackLandTransactionPending={
            isClaimingBackLandTransactionPending
          }
          rental={rental}
        />
      ) : null}
      <Card.Content className={isCatalogItem(asset) ? 'catalog' : ''}>
        <Card.Header>
          <div className={isCatalogItem(asset) ? 'catalogTitle' : 'title'}>
            {title}
            {!isNFT(asset) && isCatalogItem(asset) && (
              <span className="creator">
                <Profile address={asset.creator} textOnly />
              </span>
            )}
          </div>
          {!isCatalogItem(asset) && price ? (
            <Mana network={asset.network} inline>
              {fomrmatWeiToAssetCard(price)}
            </Mana>
          ) : rentalPricePerDay ? (
            <RentalPrice asset={asset} rentalPricePerDay={rentalPricePerDay} />
          ) : null}
        </Card.Header>
        <div className="sub-header">
          {!isCatalogItem(asset) && (
            <Card.Meta className="card-meta">
              {t(`networks.${asset.network.toLowerCase()}`)}
            </Card.Meta>
          )}

          {rentalPricePerDay && price ? (
            <div>
              <RentalPrice
                asset={asset}
                rentalPricePerDay={rentalPricePerDay}
              />
            </div>
          ) : null}
        </div>
        {catalogItemInformation()}

        {parcel ? <ParcelTags nft={asset as NFT} /> : null}
        {estate ? <EstateTags nft={asset as NFT} /> : null}
        {wearable ? <WearableTags asset={asset} /> : null}
        {emote ? <EmoteTags asset={asset} /> : null}
        {ens ? <ENSTags nft={asset as NFT} /> : null}
      </Card.Content>
    </Card>
  )
}

export default React.memo(AssetCard)
