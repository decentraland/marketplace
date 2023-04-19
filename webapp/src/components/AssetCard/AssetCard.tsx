import React, { useMemo } from 'react'
import { RentalListing } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'
import { Card, Icon } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import {
  getAssetName,
  getAssetUrl,
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
import { Mana } from '../Mana'
import { AssetImage } from '../AssetImage'
import { ParcelTags } from './ParcelTags'
import { EstateTags } from './EstateTags'
import { WearableTags } from './WearableTags'
import { EmoteTags } from './EmoteTags'
import { ENSTags } from './ENSTags'
import { Props } from './AssetCard.types'
import './AssetCard.css'
import { LinkedProfile } from '../LinkedProfile'
import mintingIcon from '../../images/minting.png'

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
        {formatWeiMANA(rentalPricePerDay)}
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
    rental
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
    if (isCatalogItem(asset)) {
      if (asset.isOnSale && asset.available > 0) {
        information = {
          action: t('asset_card.available_for_mint'),
          actionIcon: mintingIcon,
          price: asset.minPrice,
          extraInformation:
            asset.maxListingPrice && asset.minListingPrice ? (
              <span>
                {asset.listings} {t('asset_card.listings')}:&nbsp;
                <Mana
                  withTooltip
                  size="small"
                  network={asset.network}
                  className="tiniMana"
                >
                  {formatWeiMANA(asset.minListingPrice)}
                </Mana>
                &nbsp; - {formatWeiMANA(asset.maxListingPrice)}
              </span>
            ) : null
        }
      } else if (asset.minListingPrice) {
        information = {
          action: t('asset_card.cheapest_listing'),
          actionIcon: null,
          price: asset.minPrice,
          extraInformation:
            asset.maxListingPrice && asset.minListingPrice ? (
              <span>
                {asset.listings} {t('asset_card.listings')}:&nbsp;
                <Mana
                  withTooltip
                  size="small"
                  network={asset.network}
                  className="tiniMana"
                >
                  {formatWeiMANA(asset.minListingPrice)}
                </Mana>
                &nbsp; - {formatWeiMANA(asset.maxListingPrice)}
              </span>
            ) : null
        }
      } else {
        information = {
          action: t('asset_card.not_for_sale'),
          actionIcon: null,
          price: null,
          extraInformation: `${asset.owners} Owners`
        }
      }
    }
    return information ? (
      <div className="CatalogItemInformation">
        <span>
          {information.action} &nbsp;
          {information.actionIcon && (
            <img
              src={information.actionIcon}
              alt="mint"
              style={{ height: 14 }}
            />
          )}
        </span>

        {information.price && (
          <div className="PriceInMana">
            <Mana
              withTooltip
              size="large"
              network={asset.network}
              className="PriceInMana"
            >
              {formatWeiMANA(information.price)}
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
      className="AssetCard"
      link
      as={Link}
      to={getAssetUrl(asset, isManager && isLand(asset))}
      onClick={onClick}
    >
      <AssetImage
        className="AssetImage"
        asset={asset}
        showOrderListedTag={showListedTag}
        showMonospace
      />
      {showRentalBubble ? (
        <RentalChip
          asset={asset}
          isClaimingBackLandTransactionPending={
            isClaimingBackLandTransactionPending
          }
          rental={rental}
        />
      ) : null}
      <Card.Content>
        <Card.Header>
          <div className="title">
            {title}
            {isCatalogItem(asset) && (
              <LinkedProfile
                address={asset.contractAddress}
                textOnly={true}
                className="Creator"
              />
            )}
          </div>
          {!catalogItemInformation && price ? (
            <Mana network={asset.network} inline>
              {formatWeiMANA(price)}
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
        {emote ? <EmoteTags nft={asset as NFT} /> : null}
        {ens ? <ENSTags nft={asset as NFT} /> : null}
      </Card.Content>
    </Card>
  )
}

export default React.memo(AssetCard)
