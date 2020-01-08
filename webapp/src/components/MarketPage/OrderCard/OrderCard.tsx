import React from 'react'
import { Card, Image, Mana } from 'decentraland-ui'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Props } from './OrderCard.types'

import './OrderCard.css'

const capitalize = (value: string) => value[0].toUpperCase() + value.slice(1)

const OrderCard = (props: Props) => {
  const { order } = props
  return (
    <Card className="OrderCard" link>
      <Image src={order.nft.image} wrapped ui={false} />
      <Card.Content>
        <Card.Header>
          <div className="title">
            {order.nft.name || capitalize(order.category)}
          </div>{' '}
          <Mana inline>
            {(parseInt(order.price, 10) / 10 ** 18).toLocaleString()}
          </Mana>
        </Card.Header>
        <Card.Meta>
          Expires {formatDistanceToNow(+order.expiresAt, { addSuffix: true })}
        </Card.Meta>
      </Card.Content>
    </Card>
  )
}

export default React.memo(OrderCard)
