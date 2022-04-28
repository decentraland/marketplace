import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'
import { Card } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { getAssetName, getAssetUrl } from '../../modules/asset/utils'
import { NFT } from '../../modules/nft/types'
import { Mana } from '../Mana'
import { ParcelTags } from './ParcelTags'
import { EstateTags } from './EstateTags'
import { WearableTags } from './WearableTags'
import { EmoteTags } from './EmoteTags'
import { ENSTags } from './ENSTags'
import { AssetImage } from '../AssetImage'
import { Props } from './AssetCard.types'
import ListedBadge from '../ListedBadge'
import './AssetCard.css'

const AssetCard = (props: Props) => {
  const { asset, price, showListedTag } = props

  const title = getAssetName(asset)
  const { parcel, estate, wearable, emote, ens } = asset.data

  return (
    <Card className="AssetCard" link as={Link} to={getAssetUrl(asset)}>
      <AssetImage asset={asset} showMonospace />
      {showListedTag && <ListedBadge className="listed-badge" />}
      <Card.Content>
        <Card.Header>
          <div className="title">{title}</div>
          {price ? (
            <Mana network={asset.network} inline>
              {formatWeiMANA(price)}
            </Mana>
          ) : null}
        </Card.Header>
        <Card.Meta>{t(`networks.${asset.network.toLowerCase()}`)}</Card.Meta>
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
