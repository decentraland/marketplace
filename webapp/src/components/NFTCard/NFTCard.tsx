import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Image, Mana } from 'decentraland-ui'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Props } from './NFTCard.types'

import { Order } from '../../modules/order/types'
import './NFTCard.css'
import { locations } from '../../modules/routing/locations'

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

  return (
    <Card className="NFTCard" link onClick={handleClick}>
      <Image src={nft.image} wrapped ui={false} />
      <Card.Content>
        <Card.Header>
          <div className="title">{title}</div>{' '}
          {order ? <Mana inline>{getPrice(order)}</Mana> : null}
        </Card.Header>
        <Card.Meta>
          {order
            ? t('nft_card.expires_at', { date: getExpiresAt(order) })
            : null}
        </Card.Meta>
      </Card.Content>
    </Card>
  )
}

export default React.memo(NFTCard)
