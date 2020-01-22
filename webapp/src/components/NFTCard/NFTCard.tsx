import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Mana } from 'decentraland-ui'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Props } from './NFTCard.types'

import { locations } from '../../modules/routing/locations'
import { RARITY_COLOR } from '../../modules/nft/wearable/types'
import { Order } from '../../modules/order/types'
import { ParcelTags } from './ParcelTags'
import { EstateTags } from './EstateTags'
import { WearableTags } from './WearableTags'
import './NFTCard.css'

const getPrice = (order: Order) =>
  (parseInt(order.price, 10) / 10 ** 18).toLocaleString()

const getExpiresAt = (order: Order) =>
  formatDistanceToNow(+order.expiresAt, { addSuffix: true })

const NFTCard = (props: Props) => {
  const { nft, order, onNavigate } = props

  const title = nft.name || t(`detail.${nft.category}`)

  const handleClick = useCallback(
    () => onNavigate(locations.ntf(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )

  let imgStyle
  if (nft.wearable) {
    imgStyle = { backgroundColor: RARITY_COLOR[nft.wearable.rarity] }
  }

  return (
    <Card className="NFTCard" link onClick={handleClick}>
      <div className="image-wrapper" style={imgStyle}>
        <img className="image" src={nft.image} />
      </div>
      <Card.Content>
        <Card.Header>
          <div className="title">{title}</div>{' '}
          {order ? <Mana inline>{getPrice(order)}</Mana> : null}
        </Card.Header>
        {order ? (
          <Card.Meta>
            {t('nft_card.expires_at', { date: getExpiresAt(order) })}
          </Card.Meta>
        ) : null}
        {nft.parcel ? <ParcelTags nft={nft} /> : null}
        {nft.estate ? <EstateTags nft={nft} /> : null}
        {nft.wearable ? <WearableTags nft={nft} /> : null}
      </Card.Content>
    </Card>
  )
}

export default React.memo(NFTCard)
