import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'
import { Card, Icon } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { getAssetName, getAssetUrl } from '../../modules/asset/utils'
import { Asset } from '../../modules/asset/types'
import { NFT } from '../../modules/nft/types'
import { isLand, isParcel } from '../../modules/nft/utils'
import { Mana } from '../Mana'
import { AssetImage } from '../AssetImage'
import ListedBadge from '../ListedBadge'
import { ParcelTags } from './ParcelTags'
import { EstateTags } from './EstateTags'
import { WearableTags } from './WearableTags'
import { EmoteTags } from './EmoteTags'
import { ENSTags } from './ENSTags'
import { Props } from './AssetCard.types'
import './AssetCard.css'

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

const AssetCard = (props: Props) => {
  const {
    asset,
    isManager,
    price,
    rentalPricePerDay,
    showListedTag,
    onClick,
    isClaimingBackLandTransactionPending
  } = props

  const title = getAssetName(asset)
  const { parcel, estate, wearable, emote, ens } = asset.data

  return (
    <Card
      className="AssetCard"
      link
      as={Link}
      to={getAssetUrl(asset, isManager && isLand(asset))}
      onClick={onClick}
    >
      <AssetImage asset={asset} showMonospace />
      {isClaimingBackLandTransactionPending ? (
        <div className="LandBubble">
          <Icon className="warning-icon" name="warning sign" />
          {t('manage_asset_page.rent.claiming_back', {
            asset: isParcel(asset) ? t('global.the_parcel') : t('global.the_estate')
          })}
        </div>
      ) : showListedTag ? (
        <ListedBadge className="listed-badge" />
      ) : null}
      <Card.Content>
        <Card.Header>
          <div className="title">{title}</div>
          {price ? (
            <Mana network={asset.network} inline>
              {formatWeiMANA(price)}
            </Mana>
          ) : rentalPricePerDay ? (
            <RentalPrice asset={asset} rentalPricePerDay={rentalPricePerDay} />
          ) : null}
        </Card.Header>
        <div className="sub-header">
          <Card.Meta className="card-meta">
            {t(`networks.${asset.network.toLowerCase()}`)}
          </Card.Meta>
          {rentalPricePerDay && price ? (
            <div>
              <RentalPrice
                asset={asset}
                rentalPricePerDay={rentalPricePerDay}
              />
            </div>
          ) : null}
        </div>

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
